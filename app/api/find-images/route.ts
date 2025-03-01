import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const cardName = url.searchParams.get("cardName");

    if (!cardName) {
      return NextResponse.json({ error: "Card name is required" }, { status: 400 });
    }

    const cardSlug = cardName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-ก-๙]/g, "");
    console.log("🔍 Searching for:", cardSlug);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      console.error("🚨 Uploads directory does not exist!");
      return NextResponse.json({ error: "Uploads directory not found" }, { status: 500 });
    }

    const files = fs.readdirSync(uploadsDir);
    const matchingFile = files.find(file => {
      const fileName = path.parse(file).name.toLowerCase();
      return fileName === cardSlug || fileName.includes(cardSlug);
    });

    if (matchingFile) {
      return NextResponse.json({ imageUrl: `/uploads/${matchingFile}?t=${Date.now()}` });
    }

    return NextResponse.json({ imageUrl: null });

  } catch (error) {
    console.error("🚨 Error:", error);
    return NextResponse.json({ error: "Failed to find image" }, { status: 500 });
  }
}
