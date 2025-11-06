import { NextResponse } from "next/server";
import { pinata } from "@/pinata/utils/config";

export const GET = async () => {
  try {
    const url = await pinata.upload.public.createSignedURL({
      expires: 30, // URL expires in 30 seconds
    });
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error creating signed URL:", error);
    return NextResponse.json(
      { error: "Error creating signed URL" },
      { status: 500 }
    );
  }
};
