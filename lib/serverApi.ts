// lib/api/serverApi.ts
import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}

// Для серверних запитів передаємо cookies в headers
async function getHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString()
  };
}

// Отримати всі нотатки
export async function fetchNotes(search?: string, page = 1, tag?: string) {
  const headers = await getHeaders();
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', page.toString());
  params.append('perPage', '12');
  if (tag) params.append('tag', tag);

  const response = await api.get<Note[]>(`/notes?${params.toString()}`, { headers });
  return response.data;
}

// Отримати одну нотатку
export async function fetchNoteById(id: string) {
  const headers = await getHeaders();
  const response = await api.get<Note>(`/notes/${id}`, { headers });
  return response.data;
}

// Отримати профіль користувача
export async function getMe() {
  const headers = await getHeaders();
  try {
    const response = await api.get<User>('/users/me', { headers });
    return response.data;
  } catch {
    return null;
  }
}

// Перевірити сесію
export async function checkSession() {
  const headers = await getHeaders();
  try {
    const response = await api.get('/auth/session', { headers });
    return response.data;
  } catch {
    return null;
  }
}