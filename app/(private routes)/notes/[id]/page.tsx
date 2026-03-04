import { fetchNoteById } from "@/lib/api/serverApi";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  return {
    title: `details of ${note.title} note`,
    description: `${note.content}`,
    openGraph: {
      url: `https://08-zustand-kf5mmf8bz-marynas-projects-3f5c6324.vercel.app/notes/${note.id}`,
      title: `details of ${note.title} note`,
      description: `${note.content}`,
      siteName: "Notes App",
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
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}