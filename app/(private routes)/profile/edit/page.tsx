"use client";

import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";
import Image from "next/image";
import { updateMe } from "@/lib/api/clientApi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const username = formData.get("username") as string;

      const updateUser = await updateMe(username);
      setUser(updateUser);
      router.push("/profile");
    } catch (error) {
      setError("Failed to update username");
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={
            user?.avatar ??
            "https://ac.goit.global/fullstack/react/default-avatar.jpg"
          }
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username: {user?.username}</label>
            <input
              id="username"
              type="text"
              name="username"
              defaultValue={user?.username ?? ""}
              className={css.input}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}