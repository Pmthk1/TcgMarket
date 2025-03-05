"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/utils/supabase";
import { redirect } from "next/navigation";

export const createProfileAction = async (formData: FormData) => {
  const user = await currentUser();
  if (!user) {
    console.error("❌ User not authenticated");
    return { error: "User not authenticated" };
  }

  const userId = user.id;
  const email = user.primaryEmailAddress || user.emailAddresses[0]?.emailAddress || "";
  const userName = formData.get("userName") as string;
  const createdAt = new Date().toISOString();

  console.log("🔍 Checking existing profile for:", userId);

  // 🔍 ตรวจสอบว่ามีโปรไฟล์อยู่แล้วหรือไม่
  const { data: existingProfile, error: checkError } = await supabase
    .from("users")
    .select("*")
    .eq("clerkId", userId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("❌ Error checking profile:", checkError.message);
    return { error: "Failed to check existing profile" };
  }

  if (existingProfile) {
    console.log("✅ Profile already exists. Redirecting...");
    redirect("/");
  }

  console.log("🟢 Creating new profile...");

  // 📝 สร้างโปรไฟล์ใหม่
  const { error: insertError } = await supabase.from("users").insert([
    {
      clerkId: userId,
      username: userName,
      email: email,
      created_at: createdAt,
    },
  ]);

  if (insertError) {
    console.error("❌ Failed to create profile:", insertError.message);
    return { error: "Failed to create profile" };
  }

  console.log("✅ Profile created successfully. Redirecting...");
  redirect("/");
};
