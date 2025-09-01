"use server";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/utils/supabase";

export const createProfileAction = async (formData: FormData) => {
  const user = await currentUser();
  if (!user) {
    console.error("Error: User not authenticated");
    return { error: "User not authenticated" };
  }

  // ✅ Check if supabase is configured
  if (!supabase) {
    console.error("Error: Supabase not configured");
    return { error: "Database not configured" };
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
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { hasProfile: true },
    });
    console.log("✅ Clerk publicMetadata updated successfully.");
  } catch (clerkError) {
    console.error("❌ Failed to update Clerk metadata:", clerkError);
  }

  console.log("Profile created successfully:", data);
  return { success: true, data };
};