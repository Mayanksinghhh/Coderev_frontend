const API_BASE = 'https://coderev-7rnh.onrender.com';

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'API error');
    return data;
} 
