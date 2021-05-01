import { authStore } from 'store';

export const API_HOST = 'http://192.168.2.103:3003';

async function request(path, options = {}) {
  const url = `${API_HOST}${path}`;
  console.warn('url', url, options);

  const headers: any = {
    Accept: 'aplication/json',
    'Content-Type': 'application/json',
  };

  if (authStore.isAuthorized) {
    headers.Authorization = authStore.sessionKey;
  }

  const response = await fetch(url, {
    headers,
    ...options,
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw response;
  }
}

const api = {
  get: path => {
    return request(path);
  },
  post: (path, body) => {
    return request(path, {
      method: 'post',
      body: JSON.stringify(body),
    });
  },
  put: (path, body) => {
    return request(path, {
      method: 'put',
      body: JSON.stringify(body),
    });
  },
  delete: (path, body) => {
    return request(path, {
      method: 'delete',
      body: JSON.stringify(body),
    });
  },
};

export default api;
