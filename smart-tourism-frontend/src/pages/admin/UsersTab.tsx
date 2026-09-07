import { useCallback, useEffect, useState } from "react";
import {
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  deleteAdminUser,
  type AdminUserListItem,
} from "../../api/admin";
import { ApiError } from "../../api/client";
import Pagination from "../../components/Pagination";

export default function UsersTab() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getAdminUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter === "" ? undefined : statusFilter === "active",
        page,
        pageSize: 10,
      });
      setUsers(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load users.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Any filter change should reset back to page 1, otherwise a narrower
  // filter could leave the user stranded on a page that no longer exists.
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }
  function handleRoleFilterChange(value: string) {
    setRoleFilter(value);
    setPage(1);
  }
  function handleStatusFilterChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  async function handleToggleStatus(user: AdminUserListItem) {
    setBusyUserId(user.id);
    try {
      await updateUserStatus(user.id, !user.isActive);
      await loadUsers();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't update status.");
    } finally {
      setBusyUserId(null);
    }
  }

  async function handleChangeRole(user: AdminUserListItem) {
    const newRole = user.role === "Admin" ? "Tourist" : "Admin";
    if (!confirm(`Change ${user.fullName}'s role to ${newRole}?`)) return;

    setBusyUserId(user.id);
    try {
      await updateUserRole(user.id, newRole);
      await loadUsers();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't update role.");
    } finally {
      setBusyUserId(null);
    }
  }

  async function handleDelete(user: AdminUserListItem) {
    if (!confirm(`Remove ${user.fullName}? This can't be undone from here.`)) return;

    setBusyUserId(user.id);
    try {
      await deleteAdminUser(user.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Not a real failure: the backend deactivates instead of hard-deleting
        // users who have reviews on record, to avoid orphaning that history.
        // The message explains this — still worth surfacing, then refresh.
        alert(err.message);
      } else {
        alert(err instanceof ApiError ? err.message : "Couldn't remove user.");
        setBusyUserId(null);
        return;
      }
    }
    await loadUsers();
    setBusyUserId(null);
  }

  return (
    <section className="dash-section">
      <div className="admin-section-header">
        <h2 className="dash-section-title">Users</h2>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => handleRoleFilterChange(e.target.value)}>
          <option value="">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Tourist">Tourist</option>
        </select>
        <select value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      {isLoading ? (
        <p className="admin-empty-state">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="admin-empty-state">No users match these filters.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="admin-role-pill">{u.role}</span>
                  </td>
                  <td>
                    <span className={`admin-status-pill ${u.isActive ? "active" : "inactive"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button disabled={busyUserId === u.id} onClick={() => handleToggleStatus(u)}>
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button disabled={busyUserId === u.id} onClick={() => handleChangeRole(u)}>
                        Make {u.role === "Admin" ? "Tourist" : "Admin"}
                      </button>
                      <button
                        className="admin-danger"
                        disabled={busyUserId === u.id}
                        onClick={() => handleDelete(u)}
                      >
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
    </section>
  );
}
