import { User } from "@/types/user";
import { fetchNotesResponseProps, myKey, nextServer } from "./api";
import { cookies } from "next/headers";
import { Note } from "@/types/note";

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getMe = async () => {
      const cookieStore = await cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchNotes = async (
  page: number = 1,
  searchText: string = "",
  tag?: Note["tag"],
) => {
      const cookieStore = await cookies();
  const { data } = await nextServer.get<fetchNotesResponseProps>("/notes", {
    headers: {
      Authorization: `Bearer ${myKey}`,
      Cookie: cookieStore.toString(),
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

export const fetchNoteById = async (id: Note["id"]) => {
      const cookieStore = await cookies();
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};