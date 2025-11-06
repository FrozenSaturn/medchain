import React from "react";
import { Award, Shield, Lock, Eye, Share2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MedicalNFTsTile = ({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) => {
  const nftCollection = [
    {
      id: 1,
      name: "Blood Test #001",
      type: "Laboratory Results",
      date: "2024-01-15",
      verified: true,
      rarity: "Common",
    },
    {
      id: 2,
      name: "X-Ray Scan #045",
      type: "Imaging Report",
      date: "2024-01-10",
      verified: true,
      rarity: "Rare",
    },
    {
      id: 3,
      name: "Vaccination Record",
      type: "Immunization",
      date: "2024-01-05",
      verified: true,
      rarity: "Common",
    },
  ];

  return (
    <Card className="h-full bg-[#388E3C]/10 border-[#388E3C]/20 backdrop-blur-sm hover:border-[#388E3C]/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#388E3C]/20">
              <Award className="h-5 w-5 text-[#388E3C]" />
            </div>
            <CardTitle className="text-[#FAFAFA] font-sf-pro-bold">
              Medical NFTs
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("nfts")}
            className="border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 font-sf-pro-medium"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#FAFAFA]/70 font-sf-pro-regular text-sm">
          Your blockchain-verified medical records as NFTs
        </p>

        {/* NFT Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20">
            <div className="text-lg font-sf-pro-bold text-[#388E3C]">
              {nftCollection.length}
            </div>
            <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
              Total NFTs
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20">
            <div className="text-lg font-sf-pro-bold text-[#388E3C]">100%</div>
            <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
              Verified
            </div>
          </div>
        </div>

        {/* NFT Collection */}
        <div className="space-y-2">
          {nftCollection.map((nft) => (
            <div
              key={nft.id}
              className="p-2 rounded-lg bg-[#388E3C]/10 border border-[#388E3C]/20"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-[#388E3C]" />
                  <span className="text-sm font-sf-pro-medium text-[#FAFAFA]">
                    {nft.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-[#388E3C] hover:bg-[#388E3C]/20"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-[#388E3C] hover:bg-[#388E3C]/20"
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
                  {nft.type} • {nft.date}
                </div>
                <div className="text-xs font-sf-pro-medium text-[#388E3C]">
                  {nft.rarity}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#FAFAFA]/60 font-sf-pro-regular">
          <Lock className="h-3 w-3 text-[#388E3C]" />
          <span>Blockchain-verified and tamper-proof</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalNFTsTile;
