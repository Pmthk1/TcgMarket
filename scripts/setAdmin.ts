import { updateUserMetadata, getUserMetadata } from "@/lib/metadata";

const userId = "user_2sstw34CMCvkoEfk4cOvoMsn0ni"; // Clerk ID ของบัญชีที่ต้องการเป็น Admin

(async () => {
  console.log(`🚀 Setting user ${userId} as admin...`);
  
  await updateUserMetadata(userId, { role: "admin" });

  // ตรวจสอบว่า metadata อัปเดตสำเร็จหรือไม่
  const metadata = await getUserMetadata(userId);
  console.log(`🛠️ Final Metadata:`, metadata);
})();
