export async function apiFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Unknown error");
    }

    return data.data;
  } catch (err: any) {
    throw new Error(err.message || "Request failed");
  }
}