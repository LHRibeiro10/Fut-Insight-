const jsonHeaders = {
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    let message = `Erro na API (${response.status})`;

    try {
      const data = await response.json();
      message = data?.message || data?.error || message;
    } catch {
      // noop
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getCurrentUser() {
    return request("/api/auth/me");
  },
  login(data) {
    return request("/api/auth/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },
  register(data) {
    return request("/api/auth/register", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },
  logout() {
    return request("/api/auth/logout", {
      method: "POST",
      headers: jsonHeaders,
    });
  },
  getBootstrap() {
    return request("/api/bootstrap");
  },
  getBackup() {
    return request("/api/backup");
  },
  restoreData(data) {
    return request("/api/restore", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
  },
  createItem(collection, payload) {
    return request(`/api/${collection}`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });
  },
  updateItem(collection, id, payload) {
    return request(`/api/${collection}/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });
  },
  deleteItem(collection, id) {
    return request(`/api/${collection}/${id}`, {
      method: "DELETE",
    });
  },
};

