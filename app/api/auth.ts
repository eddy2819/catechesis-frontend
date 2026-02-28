"use client";

export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Credenciales inválidas");

  const data = await res.json();

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user)); // opcional: guarda info del usuario
  return data;
}

export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export function getStoredUser() {
  return typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;
}
