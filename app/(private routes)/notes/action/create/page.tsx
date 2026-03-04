import css from "./CreateNote.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Note Form",
  description: "Form for creating a new note",
  openGraph: {
    url: `https://08-zustand-kf5mmf8bz-marynas-projects-3f5c6324.vercel.app/notes/action/create`,
    title: "New Note Form",
    description: "Form for creating a new note",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 600,
        height: 300,
        alt: "Notes App preview image",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}