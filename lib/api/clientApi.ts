import { User } from "@/types/user";
import {
  CheckSessionRequest,
  createNoteProps,
  fetchNotesResponseProps,
  LoginRequest,
  myKey,
  nextServer,
  RegisterRequest,
} from "./api";
import { Note } from "@/types/note";



export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const updateMe = async (username: string) => {
  const { data } = await nextServer.patch<User>("/users/me", {username});
  return data;
};



export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const createNote = async ({ content, tag, title }: createNoteProps) => {
  const { data } = await nextServer.post<Note>(
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
  const { data } = await nextServer.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return data;
};

export const fetchNoteById = async (id: Note["id"]) => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return data;
};



export const fetchNotes = async (
  page: number = 1,
  searchText: string = "",
  tag?: Note["tag"],
) => {
  const { data } = await nextServer.get<fetchNotesResponseProps>("/notes", {
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