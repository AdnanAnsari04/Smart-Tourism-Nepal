import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "../../api/admin";
import { ApiError } from "../../api/client";

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function OverviewTab() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const data = await getDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError("Your account doesn't have admin access.");
        } else {
          setError("Couldn't load dashboard stats. Is the backend running?");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <p className="admin-empty-state">Loading dashboard…</p>;
  }

  if (error) {
    return <p className="admin-form-error">{error}</p>;
  }

  if (!stats) return null;

  return (
    <>
      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Total Users</p>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Users</p>
          <p className="stat-value accent">{stats.activeUsers}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Destinations</p>
          <p className="stat-value">{stats.totalDestinations}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Hotels</p>
          <p className="stat-value">{stats.totalHotels}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Trekking Routes</p>
          <p className="stat-value">{stats.totalTrekkingRoutes}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Reviews</p>
          <p className="stat-value">{stats.totalReviews}</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">New Users (7 days)</p>
          <p className="stat-value accent">{stats.newUsersLast7Days}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">New Reviews (7 days)</p>
          <p className="stat-value accent">{stats.newReviewsLast7Days}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Provinces</p>
          <p className="stat-value">{stats.totalProvinces}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Admins</p>
          <p className="stat-value">{stats.totalAdmins}</p>
        </div>
      </div>

      <section className="dash-section">
        <h2 className="dash-section-title">Recent users</h2>
        <div className="list-card">
          {stats.recentUsers.length === 0 && <p className="admin-empty-state">No users yet.</p>}
          {stats.recentUsers.map((u) => (
            <div className="list-row" key={u.id}>
              <div>
                <p className="list-row-title">{u.fullName}</p>
                <p className="list-row-meta">
                  {u.email} · {u.role} · joined {timeAgo(u.createdAt)}
                </p>
              </div>
              <span className={`admin-status-pill ${u.isActive ? "active" : "inactive"}`}>
                {u.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="dash-section">
        <h2 className="dash-section-title">Recent activity</h2>
        <div className="list-card">
          {stats.recentActivity.length === 0 && <p className="admin-empty-state">No activity recorded yet.</p>}
          {stats.recentActivity.map((a) => (
            <div className="list-row" key={a.id}>
              <div>
                <p className="list-row-title">{a.userFullName}</p>
                <p className="list-row-meta">
                  {a.activityType}
                  {a.description ? ` — ${a.description}` : ""}
                </p>
              </div>
              <span className="list-row-meta">{timeAgo(a.createdAt)}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
