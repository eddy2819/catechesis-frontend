// lib/parents.ts
import { apiFetch } from "./api";

export interface ParentPayload {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  relationship_type: "mother" | "father" | "guardian" | "other";
  address?: string | null;
  occupation?: string | null;
  student_ids: string[];
}

export interface ParentAttendance {
  id: string;
  parent_id: string;
  meeting_date: string;
  status: "present" | "absent" | "excused";
  notes?: string | null;
}

export function createParent(parent: ParentPayload) {
  return apiFetch("/parents/", {
    method: "POST",
    body: JSON.stringify(parent),
  });
}

export function listParents() {
  return apiFetch("/parents/");
}

export function getParent(id: string) {
  return apiFetch<ParentPayload>(`/parents/${id}`);
}
