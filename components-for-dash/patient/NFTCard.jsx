import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const NFTCardProps = { 
  appointment_id: string,
  patient_wallet_address: string,
  doctor_wallet_address: string,
  diagnosis: string | null,
  treatment: string | null,
  token_uri: string,
};

export function NFTCard({
  patient_wallet_address,
  doctor_wallet_address,
  diagnosis,
  treatment,
  token_uri,
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Medical Record NFT</CardTitle>
        <CardDescription>Patient: {patient_wallet_address}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative aspect-square w-full">
          <Image
            alt="NFT Image"
            className="rounded-lg object-cover"
            src={token_uri}
            fill
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Doctor
          </p>
          <p>{doctor_wallet_address}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Diagnosis
          </p>
          <p>{diagnosis || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Treatment
          </p>
          <p>{treatment || "N/A"}</p>
        </div>
      </CardContent>
      <CardFooter>
        <a
          href={token_uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-500 hover:underline"
        >
          View on IPFS
        </a>
      </CardFooter>
    </Card>
  );
}
