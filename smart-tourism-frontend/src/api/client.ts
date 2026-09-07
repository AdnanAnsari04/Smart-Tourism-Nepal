// Small fetch wrapper around the backend API. No axios dependency needed —
// native fetch is enough, and this keeps the frontend's install list short.
//
// The backend URL comes from VITE_API_URL (see .env / .env.example at the
// project root). Vite only exposes env vars prefixed with VITE_ to the
// browser bundle, and only reads .env files at dev-server start — restart
// `npm run dev` after changing it.

const API_BASE_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string[]> | null;

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean; // attach the stored access token as a Bearer header
}

// Matches SmartTourism.Api's ApiErrorResponse (see Middleware/ExceptionHandlingMiddleware.cs).
interface BackendErrorShape {
  message?: string;
  errors?: Record<string, string[]> | null;
}

function getStoredAccessToken(): string | null {
  return localStorage.getItem("yatra.session.accessToken");
}

/** Builds a "?a=1&b=2" query string from an object, skipping undefined,
 * null, and empty-string values so optional filters don't pollute the URL
 * (and so the backend's optional query params stay genuinely optional). */
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function apiRequest<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network-level failure: backend not running, wrong URL, CORS block, etc.
    throw new ApiError(
      "Couldn't reach the server. Make sure the backend is running and VITE_API_URL is correct.",
      0
    );
  }

  // 204 No Content (e.g. logout, delete) has no body to parse.
  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const errorData = (data ?? {}) as BackendErrorShape;
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}.`,
      response.status,
      errorData.errors ?? null
    );
  }

  return data as TResponse;
}
