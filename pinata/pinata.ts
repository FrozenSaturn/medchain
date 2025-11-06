import { pinata } from "./utils/config";
import { promises as fs } from "fs";
import path from "path";

/**
 * Uploads a file to Pinata.
 * @param file The file to upload. Can be from a form input or created from a buffer.
 * @returns The IPFS CID of the uploaded file.
 */
async function uploadToPinataForLocal(file: File) {
  try {
    const result = await pinata.upload.public.file(file);
    console.log("Successfully uploaded to Pinata, CID:", result.cid);
    return result.cid;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw new Error("Failed to upload file to Pinata.");
  }
}

/**
 * Uploads a JSON object to Pinata.
 * @param data The JSON data to upload.
 * @returns The IPFS CID of the uploaded JSON.
 */
export async function uploadJSONToPinata(data: object) {
  try {
    const result = await pinata.upload.public.json(data);
    console.log("Successfully uploaded JSON to Pinata, CID:", result.cid);
    return result.cid;
  } catch (error) {
    console.error("Error uploading JSON to Pinata:", error);
    throw new Error("Failed to upload JSON to Pinata.");
  }
}

/**
 * Constructs a URL to fetch a file from Pinata's gateway.
 * @param cid The IPFS CID of the file.
 * @returns The full URL to access the file via the gateway.
 */
export function getFromPinata(cid: string) {
  const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL;
  if (!gateway) {
    throw new Error("NEXT_PUBLIC_GATEWAY_URL is not set.");
  }
  return `https://${gateway}/ipfs/${cid}`;
}

/**
 * Uploads a local file from a specified path to Pinata.
 * This example reads from the 'public' directory.
 * @param relativePath The path to the file relative to the project root's 'public' directory (e.g., 'logo.png').
 * @param pinataFileName The name for the file on Pinata.
 * @returns The IPFS CID of the uploaded file, or undefined on error.
 */
export async function uploadLocalFile(
  relativePath: string,
  pinataFileName: string
) {
  try {
    const filePath = path.join(process.cwd(), "public", relativePath);
    const fileBuffer = await fs.readFile(filePath);

    // The File class is globally available in modern Node.js versions.
    const file = new File([fileBuffer], pinataFileName);

    // Use the existing uploadToPinata function
    const cid = await uploadToPinataForLocal(file);
    console.log(
      `Successfully uploaded local file "${relativePath}" to Pinata. CID: ${cid}`
    );
    return cid;
  } catch (error) {
    console.error(
      `Error uploading local file from path: ${relativePath}`,
      error
    );
    // Depending on requirements, you might want to re-throw or handle differently.
    return undefined;
  }
}
