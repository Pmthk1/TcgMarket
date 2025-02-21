"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ ใช้ Clerk SDK
import { supabase } from "@/utils/supabase";

export const createProfileAction = async (formData: FormData) => {
  const user = await currentUser();

  if (!user) {
    console.error("Error: User not authenticated");
    return { error: "User not authenticated" };
  }

  const userId = user.id;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const userName = formData.get("userName") as string;

  console.log("Saving profile for user:", userId, firstName, lastName, userName);

  // ✅ บันทึกข้อมูลใน Supabase
  const { data, error } = await supabase.from("Users").insert([
    {
      id: userId,
      firstName,
      lastName,
      userName,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error saving profile:", error.message);
    return { error: error.message };
  }

  // ✅ อัปเดต `publicMetadata.hasProfile` ใน Clerk
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { hasProfile: true },
    });
    console.log("✅ Clerk publicMetadata updated successfully.");
  } catch (clerkError) {
    console.error("❌ Failed to update Clerk metadata:", clerkError);
  }

  console.log("Profile created successfully:", data);
  return { success: true, data };
};
