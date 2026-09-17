const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8018";

export type Role = "client" | "counsellor";
export type CounsellorStatus = "available" | "busy" | "offline";
export type SessionType = "scheduled" | "instant";
export type SessionStatus = "pending" | "confirmed" | "in_progress" | "completed";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  specialty: string | null;
  bio: string | null;
  status: CounsellorStatus | null;
  created_at: string;
}

export interface CounsellingSession {
  id: number;
  client_id: number;
  counsellor_id: number | null;
  type: SessionType;
  status: SessionStatus;
  scheduled_time: string | null;
  created_at: string;
  client: User;
  counsellor: User | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  createUser: (input: { name: string; email: string; role: Role; specialty?: string; bio?: string }) =>
    request<User>("/api/users", { method: "POST", body: JSON.stringify(input) }),

  getUser: (id: number) => request<User>(`/api/users/${id}`),

  listClients: () => request<User[]>("/api/clients"),

  listCounsellors: (opts?: { available?: boolean; specialty?: string }) => {
    const params = new URLSearchParams();
    if (opts?.available !== undefined) params.set("available", String(opts.available));
    if (opts?.specialty) params.set("specialty", opts.specialty);
    const qs = params.toString();
    return request<User[]>(`/api/counsellors${qs ? `?${qs}` : ""}`);
  },

  setCounsellorStatus: (id: number, status: CounsellorStatus) =>
    request<User>(`/api/counsellors/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  counsellorSessions: (id: number) => request<CounsellingSession[]>(`/api/counsellors/${id}/sessions`),

  clientSessions: (id: number) => request<CounsellingSession[]>(`/api/clients/${id}/sessions`),

  bookScheduled: (input: { client_id: number; counsellor_id: number; scheduled_time: string }) =>
    request<CounsellingSession>("/api/sessions/scheduled", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  requestInstant: (client_id: number) =>
    request<CounsellingSession>("/api/sessions/instant", {
      method: "POST",
      body: JSON.stringify({ client_id }),
    }),

  getSession: (id: number) => request<CounsellingSession>(`/api/sessions/${id}`),
};
