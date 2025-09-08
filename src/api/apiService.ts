import { API_ENDPOINTS } from "../config/apiConfig";
import type { User, Post, Comments } from "../type/index";

// Kullanıcılar
export const getAllUsers = async (): Promise<User[]> => {
  const res = await fetch(API_ENDPOINTS.USERS.GET_ALL);
  return res.json();
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await fetch(API_ENDPOINTS.USERS.GET_BY_ID(id));
  return res.json();
};

// Postlar
export const getAllPosts = async (): Promise<Post[]> => {
  const res = await fetch(API_ENDPOINTS.POSTS.GET_ALL);
  return res.json();
};

export const getPostsByUser = async (userId: number): Promise<Post[]> => {
  const res = await fetch(API_ENDPOINTS.POSTS.GET_BY_USER(userId));
  return res.json();
};

export const createPost = async (post: Omit<Post, "id">): Promise<Post> => {
  const res = await fetch(API_ENDPOINTS.POSTS.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return res.json();
};

export const updatePost = async (post: Post): Promise<Post> => {
  const res = await fetch(API_ENDPOINTS.POSTS.UPDATE(post.id), {
    method: "PUT", // veya PATCH
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return res.json();
};

export const deletePost = async (id: number): Promise<boolean> => {
  await fetch(API_ENDPOINTS.POSTS.DELETE(id), { method: "DELETE" });
  return true;
};

// Yorumlar
export const getCommentsByPost = async (postId: number): Promise<Comments[]> => {
  const res = await fetch(API_ENDPOINTS.COMMENTS.GET_BY_POST(postId));
  return res.json();
};