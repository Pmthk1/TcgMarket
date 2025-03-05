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

  // ✅ ตรวจสอบก่อนว่ามีบัญชีอยู่แล้วหรือไม่
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("clerkId", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("❌ Supabase fetch error:", fetchError.message);
    return { error: "Failed to check existing profile" };
  }

  if (existingUser) {
    console.log("⚠️ Profile already exists, skipping creation.");
    return { success: true };
  }

  // ✅ บันทึกข้อมูลลง Supabase
  const { error: insertError } = await supabase.from("users").insert([
    {
      clerkId: userId,
      username: userName,
      email: email,
      created_at: createdAt,
    },
  ]);

  if (insertError) {
    console.error("❌ Supabase insert error:", insertError.message);
    return { error: `Failed to save profile: ${insertError.message}` };
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
