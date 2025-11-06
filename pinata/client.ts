import { pinata } from "./utils/config";

/**
 * Uploads a file to Pinata.
 * @param file The file to upload. Can be from a form input or created from a buffer.
 * @returns The IPFS CID of the uploaded file.
 */
export async function uploadToPinata(file: File) {
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
