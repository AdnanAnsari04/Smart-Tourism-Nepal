import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  type HotelListItem,
  type HotelFormValues,
} from "../../api/hotels";
import { getProvinces, getCities, type Province, type City } from "../../api/catalog";
import { ApiError } from "../../api/client";
import Pagination from "../../components/Pagination";

const emptyForm: HotelFormValues = {
  name: "",
  description: "",
  hotelType: "",
  address: "",
  destinationId: null,
  cityId: null,
  provinceId: 0,
  pricePerNightNpr: 0,
  rating: 0,
  availableRooms: 0,
  amenities: [],
  photoClass: "",
  imageUrl: "",
  latitude: null,
  longitude: null,
  contactPhone: "",
  website: "",
  isActive: true,
};

const HOTEL_TYPES = ["Hotel", "Resort", "Lodge", "Guesthouse", "Homestay", "Hostel"];

export default function HotelsTab() {
  const [items, setItems] = useState<HotelListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<HotelFormValues>(emptyForm);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadList = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getHotels({
        search: search || undefined,
        provinceId: provinceFilter === "" ? undefined : provinceFilter,
        includeInactive: true,
        page,
        pageSize: 10,
      });
      setItems(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load hotels.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, provinceFilter, page]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    getProvinces().then(setProvinces).catch(() => {});
    getCities().then(setCities).catch(() => {});
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setAmenitiesText("");
    setFormError("");
    setIsFormOpen(true);
  }

  async function openEditForm(id: number) {
    setFormError("");
    try {
      const detail = await getHotelById(id);
      setEditingId(id);
      setForm({
        name: detail.name,
        description: detail.description ?? "",
        hotelType: detail.hotelType ?? "",
        address: detail.address ?? "",
        destinationId: detail.destinationId,
        cityId: detail.cityId,
        provinceId: detail.provinceId,
        pricePerNightNpr: detail.pricePerNightNpr,
        rating: detail.rating,
        availableRooms: detail.availableRooms,
        amenities: detail.amenities,
        photoClass: detail.photoClass ?? "",
        imageUrl: detail.imageUrl ?? "",
        latitude: detail.latitude,
        longitude: detail.longitude,
        contactPhone: detail.contactPhone ?? "",
        website: detail.website ?? "",
        isActive: detail.isActive,
      });
      setAmenitiesText(detail.amenities.join(", "));
      setIsFormOpen(true);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't load this hotel.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.provinceId) {
      setFormError("Name and province are required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: HotelFormValues = {
        ...form,
        description: form.description || null,
        hotelType: form.hotelType || null,
        address: form.address || null,
        photoClass: form.photoClass || null,
        imageUrl: form.imageUrl || null,
        contactPhone: form.contactPhone || null,
        website: form.website || null,
        amenities: amenitiesText
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0),
      };

      if (editingId) {
        await updateHotel(editingId, payload);
      } else {
        await createHotel(payload);
      }
      setIsFormOpen(false);
      await loadList();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this hotel.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item: HotelListItem) {
    if (!confirm(`Remove "${item.name}"? This deactivates it (soft delete).`)) return;
    try {
      await deleteHotel(item.id);
      await loadList();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't remove this hotel.");
    }
  }

  const citiesForSelectedProvince = form.provinceId
    ? cities.filter((c) => c.provinceId === form.provinceId)
    : cities;

  return (
    <section className="dash-section">
      <div className="admin-section-header">
        <h2 className="dash-section-title">Hotels</h2>
        <button className="admin-primary-btn" onClick={openCreateForm}>
          + Add Hotel
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search hotels…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={provinceFilter}
          onChange={(e) => {
            setProvinceFilter(e.target.value ? Number(e.target.value) : "");
            setPage(1);
          }}
        >
          <option value="">All provinces</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      {isLoading ? (
        <p className="admin-empty-state">Loading hotels…</p>
      ) : items.length === 0 ? (
        <p className="admin-empty-state">No hotels match these filters.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Province</th>
                <th>Price/Night</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.provinceName}</td>
                  <td>NPR {h.pricePerNightNpr.toLocaleString()}</td>
                  <td>{h.rating.toFixed(1)}</td>
                  <td>
                    <span className={`admin-status-pill ${h.isActive ? "active" : "inactive"}`}>
                      {h.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button onClick={() => openEditForm(h.id)}>Edit</button>
                      <button className="admin-danger" onClick={() => handleDelete(h)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} totalCount={totalCount} onPageChange={setPage} />

      {isFormOpen && (
        <div className="admin-form-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="admin-form-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Hotel" : "Add Hotel"}</h3>
            {formError && <p className="admin-form-error">{formError}</p>}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-field span-2">
                  <label>Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="admin-form-field span-2">
                  <label>Description</label>
                  <textarea
                    value={form.description ?? ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Province</label>
                  <select
                    value={form.provinceId || ""}
                    onChange={(e) => setForm({ ...form, provinceId: Number(e.target.value), cityId: null })}
                  >
                    <option value="">Select a province</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-field">
                  <label>City (optional)</label>
                  <select
                    value={form.cityId ?? ""}
                    onChange={(e) => setForm({ ...form, cityId: e.target.value ? Number(e.target.value) : null })}
                  >
                    <option value="">No specific city</option>
                    {citiesForSelectedProvince.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-field">
                  <label>Hotel Type</label>
                  <select
                    value={form.hotelType ?? ""}
                    onChange={(e) => setForm({ ...form, hotelType: e.target.value })}
                  >
                    <option value="">Select a type</option>
                    {HOTEL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-field">
                  <label>Address</label>
                  <input
                    type="text"
                    value={form.address ?? ""}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Price per Night (NPR)</label>
                  <input
                    type="number"
                    step="1"
                    value={form.pricePerNightNpr}
                    onChange={(e) => setForm({ ...form, pricePerNightNpr: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Available Rooms</label>
                  <input
                    type="number"
                    step="1"
                    value={form.availableRooms}
                    onChange={(e) => setForm({ ...form, availableRooms: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Rating (0–5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating ?? 0}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field span-2">
                  <label>Amenities (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Free WiFi, Pool, Restaurant, Airport Shuttle"
                    value={amenitiesText}
                    onChange={(e) => setAmenitiesText(e.target.value)}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.latitude ?? ""}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.longitude ?? ""}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    value={form.contactPhone ?? ""}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Website</label>
                  <input
                    type="text"
                    value={form.website ?? ""}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>

                <div className="admin-form-field span-2">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={form.imageUrl ?? ""}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </div>

                {editingId && (
                  <div className="admin-form-field">
                    <label>Status</label>
                    <select
                      value={form.isActive ? "active" : "inactive"}
                      onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-secondary-btn" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn" disabled={isSaving}>
                  {isSaving ? "Saving…" : editingId ? "Save Changes" : "Create Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
