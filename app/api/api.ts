export type ApiOptions = RequestInit & {
  skipAuth?: boolean;
  parseJson?: boolean; // si false devuelve texto crudo
};

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "";
const PUBLIC_BASE_CLEAN = PUBLIC_BASE.replace(/\/$/, "");

function isClient() {
  return typeof window !== "undefined";
}

async function safeParseJson(res: Response, parseJson = true) {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  if (!parseJson) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any, message?: string) {
    super(message ?? `API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  if (!PUBLIC_BASE_CLEAN)
    throw new Error("NEXT_PUBLIC_BACKEND_URL no está configurada");

  const url = `${PUBLIC_BASE_CLEAN}/${endpoint.replace(/^\//, "")}`;

  const headers: Record<string, string> = {
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  };

  // Si se envía FormData, no forzar Content-Type
  const bodyIsFormData = options.body instanceof FormData;
  if (!bodyIsFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Añadir Authorization desde localStorage solo en cliente y si no se pide skipAuth
  if (!options.skipAuth && isClient()) {
    try {
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    } catch {
      // fallar silencioso si localStorage no está disponible
    }
  }

  const res = await fetch(url, { ...options, headers });

  // Política simple ante 401: limpiar token local y propagar error
  if (res.status === 401 && isClient()) {
    try {
      localStorage.removeItem("token");
    } catch {}
  }

  const parsed = await safeParseJson(res, options.parseJson ?? true);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      parsed,
      typeof parsed === "string" ? parsed : undefined
    );
  }

  return parsed as T;
}

export async function serverFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const SERVER_BASE = (process.env.BACKEND_URL || "").replace(/\/$/, "");
  if (!SERVER_BASE)
    throw new Error("BACKEND_URL no está configurada para uso en servidor");
  const url = `${SERVER_BASE}/${endpoint.replace(/^\//, "")}`;

  const res = await fetch(url, {
    // por defecto sin cache para datos dinámicos; ajustar según necesidad
    cache: "no-store",
    ...options,
  });

  if (res.status === 204) return null as any;
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, parsed);
  }

  return parsed as T;
}
