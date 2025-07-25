const BASE_URL = `${import.meta.env.VITE_BACKEND_BASEURL}/api`;

const handleResponse = async (res) => {
  const isJSON = res.headers.get("content-type")?.includes("application/json");
  const data = isJSON ? await res.json() : null;

  if (!res.ok) {
    const error = new Error(data?.error || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

const apiConnect = {
  get: async (endpoint, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    return handleResponse(res);
  },

  post: async (endpoint, body, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (endpoint, body, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  delete: async (endpoint, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    return handleResponse(res);
  },
};

export default apiConnect;
