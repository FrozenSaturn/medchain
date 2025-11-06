import { NextRequest, NextResponse } from "next/server";
import { uploadToPinata, getFromPinata } from "@/pinata/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const cid = await uploadToPinata(file);
    const tokenUri = getFromPinata(cid);

    return NextResponse.json({ tokenUri });
  } catch (error) {
    console.error("Error in upload API:", error);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
