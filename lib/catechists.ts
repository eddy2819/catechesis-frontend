import { apiFetch } from "./api";

export interface CatechistPayload {
  id?: string;
  first_name: string;
  last_name: string;
  ci: string;
  email: string;
  phone_number: string;
  role: "coordinador" | "catequista" | "secretario" | "auxiliar";
  specialization?: string;
  scheduled?: string;
  address?: string;
  status: "activo" | "inactivo" | "retirado";
  joined_date: string;
  date_of_birth?: string;
  service_years?: string;
  notes?: string;
}

export function createCatechist(catechist: CatechistPayload) {
  return apiFetch("/catechists/", {
    method: "POST",
    body: JSON.stringify(catechist),
  });
}

export function listCatechists() {
  return apiFetch("/catechists/");
}

export function getCatechist(id: string) {
  return apiFetch<CatechistPayload>(`/catechists/${id}`);
}

export function updateCatechist(id: string, catechist: CatechistPayload) {
  return apiFetch(`/catechists/${id}`, {
    method: "PUT",
    body: JSON.stringify(catechist),
  });
}

export function deleteCatechist(catechist_id: string) {
  return apiFetch(`/catechists/${catechist_id}`, {
    method: "DELETE",
  });
}
