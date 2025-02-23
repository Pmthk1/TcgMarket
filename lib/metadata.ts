import { clerkClient } from "@clerk/clerk-sdk-node";

/**
 * อัปเดต Public Metadata ของผู้ใช้ใน Clerk
 * @param userId รหัส Clerk ID ของผู้ใช้
 * @param metadata ข้อมูล Metadata ที่ต้องการอัปเดต
 */
export const updateUserMetadata = async (
  userId: string,
  metadata: Record<string, unknown>
) => {
  try {
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
      },
    });

    console.log(`✅ Updated public metadata for user ${userId}:`, user.publicMetadata);
  } catch (error) {
    console.error(`❌ Failed to update metadata for user ${userId}:`, error);
  }
};

/**
 * ดึง Public Metadata ของผู้ใช้จาก Clerk
 * @param userId รหัส Clerk ID ของผู้ใช้
 * @returns ข้อมูล Metadata ของผู้ใช้
 */
export const getUserMetadata = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    console.log(`📌 Current Metadata for ${userId}:`, user.publicMetadata);
    return user.publicMetadata;
  } catch (error) {
    console.error(`❌ Failed to fetch metadata for user ${userId}:`, error);
    return null;
  }
};
