// lib/students.ts
import { apiFetch } from "./api";

export interface SacramentPayload {
  baptism_date?: string | null;
  first_communion_date?: string | null;
  confirmation_date?: string | null;
}

export interface StudentPayload {
  id?: string;
  first_name: string;
  last_name: string;
  birth_date?: string | null;
  address?: string | null;
  grade?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  photo_url?: string | null;
  status: "active" | "inactive";
  sacrament?: SacramentPayload;
  parents?: string; // IDs de los padres asociados
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: "presente" | "ausente" | "justificado" | "tarde";
  notes?: string | null;
}

export function createStudent(student: StudentPayload) {
  return apiFetch("/students/", {
    method: "POST",
    body: JSON.stringify(student),
  });
}

export function createStudentAttendance(
  student_id: string,
  data?: Partial<Attendance>,
) {
  return apiFetch(`/students/attendance?student_id=${student_id}`, {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
}

export function listStudents() {
  return apiFetch("/students/");
}

export function getStudent(id: string) {
  return apiFetch<StudentPayload>(`/students/${id}`);
}

export function getAttendanceByDate(date: string) {
  return apiFetch<Attendance[]>(`/attendance/?date=${date}`);
}

export function updateStudent(student_id: string, data: StudentPayload) {
  return apiFetch(`/students/${student_id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function updateAttendance(
  attendance_id: string,
  data: Partial<Attendance>,
) {
  return apiFetch(`/attendance/${attendance_id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteStudent(id: string) {
  return apiFetch(`/students/${id}`, {
    method: "DELETE",
  });
}

export function uploadStudentPhoto(file: File) {
  const formData = new FormData();
  formData.append("file", file); // "file" debe coincidir con el backend

  // Llama a tu apiFetch pero SIN 'Content-Type: json'
  return apiFetch("/students/upload-photo", {
    method: "POST",
    body: formData,
  });
}
