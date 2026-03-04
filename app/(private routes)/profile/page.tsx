import type { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  // Якщо користувача немає - повертай базові метадані
  if (!user) {
    return {
      title: "Profile | Notes App",
      description: "User profile page",
    };
  }

  return {
    title: `Profile of ${user.username}`,
    description: `Profile page of ${user.username}`,
    openGraph: {
      url: `https://08-zustand-kf5mmf8bz-marynas-projects-3f5c6324.vercel.app/profile`,
      title: `Profile of ${user.username}`,
      description: `Profile page of ${user.username}`,
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

export default async function ProfilePage() {
  const user = await getMe();

  // Якщо користувача немає - не рендеримо сторінку
  // (редирект має спрацювати в middleware/proxy)
  if (!user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={
              user.avatar ??
              "https://ac.goit.global/fullstack/react/default-avatar.jpg"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}