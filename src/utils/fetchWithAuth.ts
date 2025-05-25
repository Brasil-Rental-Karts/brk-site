const API_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input.toString();
  const isRefresh = url.includes('/auth/refresh-token');

  let response = await fetch(input, { ...init, credentials: 'include' });

  if (response.status === 401 && !isRefresh) {
    // Tenta refresh
    const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (refreshRes.ok) {
      // Tenta novamente a requisição original
      response = await fetch(input, { ...init, credentials: 'include' });
    } else {
      // Opcional: aqui pode-se disparar logout global
      throw new Error('Sessão expirada. Faça login novamente.');
    }
  }

  return response;
} 