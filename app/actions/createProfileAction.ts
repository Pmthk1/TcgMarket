"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { supabase } from "@/utils/supabase";

export const createProfileAction = async (formData: FormData) => {
  const user = await currentUser();

  if (!user) {
    console.error("❌ Error: User not authenticated");
    return { error: "User not authenticated" };
  }

  const userId = user.id;
  const email = user.primaryEmailAddress || user.emailAddresses[0]?.emailAddress || "";
  const userName = formData.get("userName") as string;
  const createdAt = new Date().toISOString();

  console.log("🟢 Creating profile for:", { userId, userName, email });

  // ✅ บันทึกข้อมูลลง Supabase
  const { error } = await supabase.from("User").insert([
    {
      clerkId: userId,  // ใช้ Clerk ID เป็น primary key
      username: userName,
      email: email,
      created_at: createdAt,
    },
  ]);

  if (error) {
    console.error("❌ Supabase error:", error.message);
    return { error: "Failed to save profile in database" };
  }

  // ✅ อัปเดต `publicMetadata.hasProfile` ใน Clerk
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { hasProfile: true },
    });
    console.log("✅ Clerk metadata updated.");
  } catch (clerkError) {
    console.error("❌ Clerk update error:", clerkError);
    return { error: "Failed to update Clerk metadata" };
  }

  return { success: true };
};
