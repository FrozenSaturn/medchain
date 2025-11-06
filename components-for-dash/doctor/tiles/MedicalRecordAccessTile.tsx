
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, FileText, Download, ExternalLink } from 'lucide-react';

const MedicalRecordAccessTile = () => {
  // TODO: Fetch latest IPFS-linked medical record from Supabase
  const latestRecord = {
    id: 'REC001',
    patientName: 'John Smith',
    documentType: 'Lab Results',
    uploadDate: '2024-01-18',
    ipfsHash: 'QmX7yGvJz3k2HfNpQmPtK...',
    fileType: 'PDF',
    size: '1.2 MB'
  };

  const totalRecords = 45; // TODO: Fetch from Supabase

  const getFileTypeColor = (fileType: string) => {
    const colors = {
      'PDF': 'bg-red-100 text-red-800',
      'DICOM': 'bg-blue-100 text-blue-800',
      'JPG': 'bg-green-100 text-green-800',
      'PNG': 'bg-green-100 text-green-800'
    };
    return colors[fileType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <FolderOpen className="h-5 w-5 text-purple-600" />
          <span>Medical Records</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Latest Record Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{latestRecord.documentType}</h4>
              <Badge className={`text-xs ${getFileTypeColor(latestRecord.fileType)}`}>
                {latestRecord.fileType}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <FileText className="h-3 w-3" />
                <span>Patient: {latestRecord.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-3 w-3" />
                <span>IPFS: {latestRecord.ipfsHash.substring(0, 20)}...</span>
              </div>
              <div className="text-xs text-gray-500">
                Size: {latestRecord.size} • {latestRecord.uploadDate}
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            {totalRecords} total records available on IPFS
          </div>
        </div>
        
        <div className="pt-2 border-t space-y-2">
          <Button variant="default" className="w-full" size="sm">
            <Download className="h-3 w-3 mr-2" />
            Access Latest Record
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Browse All Records
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordAccessTile;
