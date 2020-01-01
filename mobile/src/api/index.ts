export const API_HOST = 'http://10.0.2.2:3003';

async function request(path, options = {}) {
  const url = `${API_HOST}${path}`;
  console.warn('url', url, options);
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: 'aplication/json',
      'Content-Type': 'application/json',
    },
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
