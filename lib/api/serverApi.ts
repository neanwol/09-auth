// lib/api/serverApi.ts
import { api } from './api';
import { cookies } from 'next/headers';
import { User } from "@/types/user";
import { Note } from "@/types/note";

async function getHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString()
  };
}

export async function fetchNotes(page = 1, searchText = "", tag?: string) {
  const headers = await getHeaders();
  const { data } = await api.get("/notes", {
    headers,
    params: { page, perPage: 12, search: searchText, tag }
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const headers = await getHeaders();
  const { data } = await api.get(`/notes/${id}`, { headers });
  return data;
}

export async function getMe() {
  const headers = await getHeaders();
  try {
    const { data } = await api.get<User>("/users/me", { headers });
    return data;
  } catch {
    return null;
  }
}

export async function checkSession() {
  const headers = await getHeaders();
  try {
    const res = await api.get("/auth/session", { headers });
    return res.status === 200;
  } catch {
    return false;
  }
}