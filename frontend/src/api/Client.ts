const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Patch in case for sending FormData (for media image upload case)
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : {"Content-Type": "application/json"}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
