"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/utils/supabase";
import { redirect } from "next/navigation";

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

  console.log("🟢 Checking existing profile for:", userId);

  // 🔍 เช็คว่ามี profile อยู่แล้วหรือยัง
  const { data: existingProfile, error: checkError } = await supabase
    .from("users")
    .select("*")
    .eq("clerkId", userId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("❌ Failed to check existing profile:", checkError);
    return { error: "Failed to check existing profile" };
  }

  if (existingProfile) {
    console.log("✅ Profile already exists. Redirecting...");
    return redirect("/");
  }

  console.log("🟢 Creating new profile...");
  
  // 📝 สร้าง profile ใหม่
  const { error: insertError } = await supabase.from("users").insert([
    {
      clerkId: userId, // ใช้ Clerk ID เป็น primary key
      username: userName,
      email: email,
      created_at: createdAt,
    },
  ]);

  if (insertError) {
    console.error("❌ Failed to create profile:", insertError);
    return { error: "Failed to create profile" };
  }

  console.log("✅ Profile created successfully. Redirecting...");
  return redirect("/profile"); // 🏃‍♂️ หลังจากสร้างโปรไฟล์เสร็จให้ข้ามไปหน้า Profile เลย
};
