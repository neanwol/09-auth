// lib/api/clientApi.ts
import { api } from './api';  // імпортуємо налаштований екземпляр
import { User } from "@/types/user";
import { Note } from "@/types/note";
import { QueryClient } from '@tanstack/react-query';

// Додай цю функцію в кінець файлу
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 хвилина
      },
    },
  });
}

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ========== АУТЕНТИФІКАЦІЯ ==========
export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async () => {
  try {
    const res = await api.get("/auth/session");
    return res.status === 200;
  } catch {
    return false;
  }
};

// ========== КОРИСТУВАЧ ==========
export const getMe = async () => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (username: string) => {
  const { data } = await api.patch<User>("/users/me", { username });
  return data;
};

// ========== НОТАТКИ ==========
export const createNote = async ({ content, tag, title }: CreateNoteProps) => {
  const { data } = await api.post<Note>("/notes", { content, tag, title });
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const fetchNotes = async (
  page: number = 1,
  searchText: string = "",
  tag?: string,
) => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search: searchText,
      tag: tag,
    },
  });
  return data;
};