const API_BASE_URL = import.meta.env.PROD
? "https://audify-rc1v.onrender.com"
: "";
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('pw_token') || '';
  const headers = { ...(options.headers || {}) };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    let errorMsg = 'Request failed';
    if (typeof data.message === 'string') {
      errorMsg = data.message;
    } else if (Array.isArray(data.message) && data.message.length > 0) {
      errorMsg = data.message[0]?.msg || data.message[0]?.message || 'Validation error';
    } else if (typeof data.error === 'string') {
      errorMsg = data.error;
    } else if (Array.isArray(data.errors) && data.errors.length > 0) {
      errorMsg = data.errors[0]?.msg || data.errors[0]?.message || 'Validation error';
    }
    throw new Error(errorMsg);
  }
  return data;
}
