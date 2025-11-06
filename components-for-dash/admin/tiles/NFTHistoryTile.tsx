
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink, Calendar, User } from 'lucide-react';

const NFTHistoryTile = () => {
  // TODO: Fetch most recently minted medical NFT from Supabase/blockchain
  const recentNFT = {
    id: 'NFT001',
    tokenId: '12345',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    appointmentId: 'BK-2024-001',
    mintedAt: '2024-01-19',
    ipfsHash: 'QmX7yGvJz3k2HfNpQmPtK...',
    diagnosis: 'Hypertension - Stage 1',
    treatmentSummary: 'Prescribed ACE inhibitors and lifestyle modifications'
  };

  const totalMintedNFTs = 18; // TODO: Fetch from blockchain/Supabase

  const handleViewIPFS = (ipfsHash: string) => {
    // TODO: Open IPFS link in new tab
    console.log(`Opening IPFS link: ${ipfsHash}`);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Award className="h-5 w-5 text-yellow-600" />
          <span>NFT History</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Recent NFT Preview */}
          <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">Latest Minted NFT</h4>
              <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">
                #{recentNFT.tokenId}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span>{recentNFT.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>Minted: {recentNFT.mintedAt}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-3 w-3" />
                <span>IPFS: {recentNFT.ipfsHash.substring(0, 20)}...</span>
              </div>
            </div>

            <div className="p-2 bg-white rounded text-xs border">
              <div className="mb-1">
                <strong>Diagnosis:</strong> {recentNFT.diagnosis}
              </div>
              <div>
                <strong>Treatment:</strong> {recentNFT.treatmentSummary.substring(0, 50)}...
              </div>
            </div>

            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2 text-xs"
              onClick={() => handleViewIPFS(recentNFT.ipfsHash)}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View on IPFS
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            {totalMintedNFTs} total medical NFTs minted
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All NFTs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTHistoryTile;
