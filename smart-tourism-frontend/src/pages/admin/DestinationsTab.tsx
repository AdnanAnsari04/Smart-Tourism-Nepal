import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
  type DestinationListItem,
  type DestinationFormValues,
} from "../../api/destinations";
import { getProvinces, getCategories, getCities, type Province, type Category, type City } from "../../api/catalog";
import { ApiError } from "../../api/client";
import Pagination from "../../components/Pagination";

const emptyForm: DestinationFormValues = {
  name: "",
  description: "",
  provinceId: 0,
  district: "",
  cityId: null,
  categoryId: 0,
  distanceFromKathmanduKm: 0,
  bestSeason: "",
  entryInformation: "",
  photoClass: "",
  imageUrl: "",
  latitude: 0,
  longitude: 0,
  isActive: true,
};

export default function DestinationsTab() {
  const [items, setItems] = useState<DestinationListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<number | "">("");
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DestinationFormValues>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadList = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getDestinations({
        search: search || undefined,
        provinceId: provinceFilter === "" ? undefined : provinceFilter,
        categoryId: categoryFilter === "" ? undefined : categoryFilter,
        includeInactive: true, // admin view: show inactive too, with a status column
        page,
        pageSize: 10,
      });
      setItems(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load destinations.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, provinceFilter, categoryFilter, page]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    getProvinces().then(setProvinces).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
    getCities().then(setCities).catch(() => {});
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  }

  async function openEditForm(id: number) {
    setFormError("");
    try {
      const detail = await getDestinationById(id);
      setEditingId(id);
      setForm({
        name: detail.name,
        description: detail.description,
        provinceId: detail.provinceId,
        district: detail.district ?? "",
        cityId: detail.cityId,
        categoryId: detail.categoryId,
        distanceFromKathmanduKm: detail.distanceFromKathmanduKm,
        bestSeason: detail.bestSeason ?? "",
        entryInformation: detail.entryInformation ?? "",
        photoClass: detail.photoClass ?? "",
        imageUrl: detail.imageUrl ?? "",
        latitude: detail.latitude,
        longitude: detail.longitude,
        isActive: detail.isActive,
      });
      setIsFormOpen(true);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't load this destination.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.description.trim() || !form.provinceId || !form.categoryId) {
      setFormError("Name, description, province, and category are required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: DestinationFormValues = {
        ...form,
        district: form.district || null,
        bestSeason: form.bestSeason || null,
        entryInformation: form.entryInformation || null,
        photoClass: form.photoClass || null,
        imageUrl: form.imageUrl || null,
      };

      if (editingId) {
        await updateDestination(editingId, payload);
      } else {
        await createDestination(payload);
      }
      setIsFormOpen(false);
      await loadList();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this destination.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item: DestinationListItem) {
    if (!confirm(`Remove "${item.name}"? This deactivates it (soft delete).`)) return;
    try {
      await deleteDestination(item.id);
      await loadList();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't remove this destination.");
    }
  }

  const citiesForSelectedProvince = form.provinceId
    ? cities.filter((c) => c.provinceId === form.provinceId)
    : cities;

  return (
    <section className="dash-section">
      <div className="admin-section-header">
        <h2 className="dash-section-title">Destinations</h2>
        <button className="admin-primary-btn" onClick={openCreateForm}>
          + Add Destination
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search destinations…"
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
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value ? Number(e.target.value) : "");
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      {isLoading ? (
        <p className="admin-empty-state">Loading destinations…</p>
      ) : items.length === 0 ? (
        <p className="admin-empty-state">No destinations match these filters.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Province</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.provinceName}</td>
                  <td>{d.categoryName}</td>
                  <td>{d.rating.toFixed(1)} ({d.reviewCount})</td>
                  <td>
                    <span className={`admin-status-pill ${d.isActive ? "active" : "inactive"}`}>
                      {d.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button onClick={() => openEditForm(d.id)}>Edit</button>
                      <button className="admin-danger" onClick={() => handleDelete(d)}>
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
            <h3>{editingId ? "Edit Destination" : "Add Destination"}</h3>
            {formError && <p className="admin-form-error">{formError}</p>}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-field span-2">
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-field span-2">
                  <label>Description</label>
                  <textarea
                    value={form.description}
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
                  <label>District</label>
                  <input
                    type="text"
                    value={form.district ?? ""}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Category</label>
                  <select
                    value={form.categoryId || ""}
                    onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-field">
                  <label>Distance from Kathmandu (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.distanceFromKathmanduKm}
                    onChange={(e) => setForm({ ...form, distanceFromKathmanduKm: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Best Season</label>
                  <input
                    type="text"
                    placeholder="e.g. Oct–Nov, Mar–May"
                    value={form.bestSeason ?? ""}
                    onChange={(e) => setForm({ ...form, bestSeason: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field span-2">
                  <label>Entry Information</label>
                  <textarea
                    placeholder="Fees, permits, opening hours, etc."
                    value={form.entryInformation ?? ""}
                    onChange={(e) => setForm({ ...form, entryInformation: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
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
                  {isSaving ? "Saving…" : editingId ? "Save Changes" : "Create Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
