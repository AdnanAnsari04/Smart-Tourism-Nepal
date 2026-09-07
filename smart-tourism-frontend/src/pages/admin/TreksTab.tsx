import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  getTrekkingRoutes,
  getTrekkingRouteById,
  createTrekkingRoute,
  updateTrekkingRoute,
  deleteTrekkingRoute,
  type TrekkingRouteListItem,
  type TrekkingRouteFormValues,
} from "../../api/trekking";
import { getProvinces, getTrekkingRegions, type Province, type TrekkingRegion } from "../../api/catalog";
import { ApiError } from "../../api/client";
import Pagination from "../../components/Pagination";

const DIFFICULTIES: Array<"Easy" | "Moderate" | "Hard"> = ["Easy", "Moderate", "Hard"];

const emptyForm: TrekkingRouteFormValues = {
  name: "",
  description: "",
  district: "",
  difficulty: "Moderate",
  minDurationDays: 1,
  maxDurationDays: 1,
  bestSeason: "",
  maxAltitudeMeters: 0,
  startingPoint: "",
  endingPoint: "",
  latitude: null,
  longitude: null,
  rating: 0,
  trekkingRegionId: 0,
  requiredPermits: [],
  equipment: [],
  photoClass: "",
  imageUrl: "",
  isActive: true,
};

export default function TreksTab() {
  const [items, setItems] = useState<TrekkingRouteListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<number | "">("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regions, setRegions] = useState<TrekkingRegion[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TrekkingRouteFormValues>(emptyForm);
  const [permitsText, setPermitsText] = useState("");
  const [equipmentText, setEquipmentText] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadList = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getTrekkingRoutes({
        search: search || undefined,
        provinceId: provinceFilter === "" ? undefined : provinceFilter,
        difficulty: difficultyFilter || undefined,
        includeInactive: true,
        page,
        pageSize: 10,
      });
      setItems(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load trekking routes.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, provinceFilter, difficultyFilter, page]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    getProvinces().then(setProvinces).catch(() => {});
    getTrekkingRegions().then(setRegions).catch(() => {});
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setPermitsText("");
    setEquipmentText("");
    setFormError("");
    setIsFormOpen(true);
  }

  async function openEditForm(id: number) {
    setFormError("");
    try {
      const detail = await getTrekkingRouteById(id);
      setEditingId(id);
      setForm({
        name: detail.name,
        description: detail.description,
        district: detail.district ?? "",
        difficulty: (detail.difficulty as "Easy" | "Moderate" | "Hard") ?? "Moderate",
        minDurationDays: detail.minDurationDays,
        maxDurationDays: detail.maxDurationDays,
        bestSeason: detail.bestSeason,
        maxAltitudeMeters: detail.maxAltitudeMeters,
        startingPoint: detail.startingPoint ?? "",
        endingPoint: detail.endingPoint ?? "",
        latitude: detail.latitude,
        longitude: detail.longitude,
        rating: detail.rating,
        trekkingRegionId: detail.trekkingRegionId,
        requiredPermits: detail.requiredPermits,
        equipment: detail.equipment,
        photoClass: detail.photoClass ?? "",
        imageUrl: detail.imageUrl ?? "",
        isActive: detail.isActive,
      });
      setPermitsText(detail.requiredPermits.join(", "));
      setEquipmentText(detail.equipment.join(", "));
      setIsFormOpen(true);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't load this trekking route.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.description.trim() || !form.trekkingRegionId || !form.bestSeason.trim()) {
      setFormError("Name, description, region, and best season are required.");
      return;
    }
    if (form.maxDurationDays < form.minDurationDays) {
      setFormError("Max duration can't be less than min duration.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: TrekkingRouteFormValues = {
        ...form,
        district: form.district || null,
        startingPoint: form.startingPoint || null,
        endingPoint: form.endingPoint || null,
        photoClass: form.photoClass || null,
        imageUrl: form.imageUrl || null,
        requiredPermits: permitsText
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0),
        equipment: equipmentText
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0),
      };

      if (editingId) {
        await updateTrekkingRoute(editingId, payload);
      } else {
        await createTrekkingRoute(payload);
      }
      setIsFormOpen(false);
      await loadList();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this trekking route.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item: TrekkingRouteListItem) {
    if (!confirm(`Remove "${item.name}"? This deactivates it (soft delete).`)) return;
    try {
      await deleteTrekkingRoute(item.id);
      await loadList();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't remove this trekking route.");
    }
  }

  return (
    <section className="dash-section">
      <div className="admin-section-header">
        <h2 className="dash-section-title">Trekking Routes</h2>
        <button className="admin-primary-btn" onClick={openCreateForm}>
          + Add Trekking Route
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search treks…"
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
          value={difficultyFilter}
          onChange={(e) => {
            setDifficultyFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      {isLoading ? (
        <p className="admin-empty-state">Loading trekking routes…</p>
      ) : items.length === 0 ? (
        <p className="admin-empty-state">No trekking routes match these filters.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Altitude</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.regionName}</td>
                  <td>{t.difficulty}</td>
                  <td>
                    {t.minDurationDays}–{t.maxDurationDays} days
                  </td>
                  <td>{t.maxAltitudeMeters.toLocaleString()} m</td>
                  <td>
                    <span className={`admin-status-pill ${t.isActive ? "active" : "inactive"}`}>
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button onClick={() => openEditForm(t.id)}>Edit</button>
                      <button className="admin-danger" onClick={() => handleDelete(t)}>
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
            <h3>{editingId ? "Edit Trekking Route" : "Add Trekking Route"}</h3>
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
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Region</label>
                  <select
                    value={form.trekkingRegionId || ""}
                    onChange={(e) => setForm({ ...form, trekkingRegionId: Number(e.target.value) })}
                  >
                    <option value="">Select a region</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.provinceName})
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
                  <label>Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as "Easy" | "Moderate" | "Hard" })}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-field">
                  <label>Best Season</label>
                  <input
                    type="text"
                    placeholder="e.g. Mar-May, Sep-Nov"
                    value={form.bestSeason}
                    onChange={(e) => setForm({ ...form, bestSeason: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Min Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.minDurationDays}
                    onChange={(e) => setForm({ ...form, minDurationDays: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Max Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxDurationDays}
                    onChange={(e) => setForm({ ...form, maxDurationDays: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Max Altitude (meters)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxAltitudeMeters}
                    onChange={(e) => setForm({ ...form, maxAltitudeMeters: Number(e.target.value) })}
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

                <div className="admin-form-field">
                  <label>Starting Point</label>
                  <input
                    type="text"
                    value={form.startingPoint ?? ""}
                    onChange={(e) => setForm({ ...form, startingPoint: e.target.value })}
                  />
                </div>

                <div className="admin-form-field">
                  <label>Ending Point</label>
                  <input
                    type="text"
                    value={form.endingPoint ?? ""}
                    onChange={(e) => setForm({ ...form, endingPoint: e.target.value })}
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

                <div className="admin-form-field span-2">
                  <label>Required Permits (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="TIMS Card, ACAP Permit"
                    value={permitsText}
                    onChange={(e) => setPermitsText(e.target.value)}
                  />
                </div>

                <div className="admin-form-field span-2">
                  <label>Recommended Equipment (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Trekking poles, Sleeping bag (-10°C)"
                    value={equipmentText}
                    onChange={(e) => setEquipmentText(e.target.value)}
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
                  {isSaving ? "Saving…" : editingId ? "Save Changes" : "Create Trekking Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
