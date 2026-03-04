import axios from "axios";
import type { Note } from "@/types/note";

export const nextServer = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type CheckSessionRequest = {
  success: boolean;
};

export interface createNoteProps {
  content: string;
  tag: string;
  title: string;
}

// axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const createNote = async ({ content, tag, title }: createNoteProps) => {
  const { data } = await axios.post<Note>(
    "/notes",
    { content, tag, title },
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    },
  );
  return data;
};

type NoteId = Note["id"];

export const deleteNote = async (id: NoteId) => {
  const { data } = await axios.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return data;
};

export const fetchNoteById = async (id: Note["id"]) => {
  const { data } = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return data;
};

interface fetchNotesResponseProps {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  searchText: string = "",
  tag?: Note["tag"],
) => {
  const { data } = await axios.get<fetchNotesResponseProps>("/notes", {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
    params: {
      page,
      perPage: 12,
      search: searchText,
      tag: tag,
    },
  });
  console.log(data);
  return data;
};