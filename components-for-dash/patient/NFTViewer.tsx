"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  ExternalLink,
  Download,
  Calendar,
  User,
  Wallet,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

// Simple type for medical records NFTs
interface MedicalNFT {
  id: string;
  appointment_id: string;
  patient_wallet_address: string;
  doctor_wallet_address: string;
  diagnosis: string | null;
  treatment: string | null;
  token_uri: string;
}

const NFTViewer = () => {
  const [medicalNFTs, setMedicalNFTs] = useState<MedicalNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Simple fetch all medical records NFTs
  const fetchAllNFTs = async () => {
    try {
      const { data, error } = await supabase
        .from("medical_records_nfts")
        .select("*");

      if (error) {
        throw new Error("Failed to fetch medical NFTs");
      }

      setMedicalNFTs(data || []);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setError("Failed to load medical NFTs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNFTs();
  }, []);

  const viewOnBlockchain = (tokenUri: string) => {
    toast({
      title: "Opening Blockchain Explorer",
      description: "Viewing NFT on blockchain...",
    });
  };

  const viewMetadata = (tokenUri: string) => {
    toast({
      title: "Opening IPFS Metadata",
      description: "Viewing NFT metadata from IPFS...",
    });
  };

  const downloadCertificate = (nft: MedicalNFT) => {
    toast({
      title: "Generating Certificate",
      description: "Your medical treatment certificate is being generated...",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">Loading medical NFTs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Error Loading NFTs
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>All Medical Records NFTs</span>
          </CardTitle>
          <p className="text-gray-600">
            Displaying all medical treatment NFTs from the database
          </p>
        </CardHeader>
        <CardContent>
          {medicalNFTs.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Medical NFTs Found
              </h3>
              <p className="text-gray-600">
                No medical treatment NFTs found in the database
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={nft.token_uri}
                      alt={`Medical NFT ${nft.id}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                        target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-4">
                      Medical NFT Record
                    </h3>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>ID:</strong> {nft.id}
                      </p>
                      <p>
                        <strong>Appointment ID:</strong> {nft.appointment_id}
                      </p>
                      <p>
                        <strong>Patient Wallet:</strong>{" "}
                        {nft.patient_wallet_address}
                      </p>
                      <p>
                        <strong>Doctor Wallet:</strong>{" "}
                        {nft.doctor_wallet_address}
                      </p>
                      <p>
                        <strong>Token URI:</strong> {nft.token_uri}
                      </p>

                      {nft.diagnosis && (
                        <p>
                          <strong>Diagnosis:</strong> {nft.diagnosis}
                        </p>
                      )}

                      {nft.treatment && (
                        <p>
                          <strong>Treatment:</strong> {nft.treatment}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTViewer;
