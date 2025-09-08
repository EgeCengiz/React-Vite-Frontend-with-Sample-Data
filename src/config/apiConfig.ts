export const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const API_ENDPOINTS = {
  USERS: {
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/users/${id}`,
  },
  POSTS: {
    GET_ALL: `${API_BASE_URL}/posts`,
    GET_BY_USER: (userId: number) => `${API_BASE_URL}/posts?userId=${userId}`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/posts/${id}`,
    CREATE: `${API_BASE_URL}/posts`,
    UPDATE: (id: number) => `${API_BASE_URL}/posts/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/posts/${id}`,
  },
  COMMENTS: {
    GET_BY_POST: (postId: number) => `${API_BASE_URL}/posts/${postId}/comments`,
  },
};
