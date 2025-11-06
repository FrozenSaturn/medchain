"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MedicalRecordUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordDescription, setRecordDescription] = useState('');

  // TODO: Fetch medical records from Supabase
  const medicalRecords = [
    {
      id: 1,
      title: 'Blood Test Results',
      description: 'Complete blood count and lipid panel',
      uploadDate: '2024-01-15',
      fileType: 'PDF',
      ipfsHash: 'QmXxYzz...abc123',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'X-Ray Chest',
      description: 'Chest X-ray for routine examination',
      uploadDate: '2024-01-10',
      fileType: 'DICOM',
      ipfsHash: 'QmYyZaa...def456',
      size: '15.2 MB'
    },
    {
      id: 3,
      title: 'Prescription History',
      description: 'Last 6 months medication history',
      uploadDate: '2024-01-05',
      fileType: 'PDF',
      ipfsHash: 'QmZzXbb...ghi789',
      size: '1.1 MB'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !recordTitle) {
      toast({
        title: "Missing Information",
        description: "Please select a file and provide a title.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Upload file to IPFS and save metadata to Supabase
    // 1. Upload file to IPFS
    // const ipfsHash = await uploadToIPFS(selectedFile);
    
    // 2. Save record metadata to Supabase
    // const { error } = await supabase
    //   .from('medical_records')
    //   .insert({
    //     patient_id: user.id,
    //     title: recordTitle,
    //     description: recordDescription,
    //     file_type: selectedFile.type,
    //     file_size: selectedFile.size,
    //     ipfs_hash: ipfsHash,
    //     upload_date: new Date().toISOString()
    //   });

    toast({
      title: "File Uploaded",
      description: "Your medical record has been uploaded to IPFS and saved securely.",
    });

    // Reset form
    setSelectedFile(null);
    setRecordTitle('');
    setRecordDescription('');
  };

  const handleViewFile = (ipfsHash: string) => {
    // TODO: Open IPFS file in new tab
    // window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank');
    toast({
      title: "Opening File",
      description: "File will open from IPFS in a new tab.",
    });
  };

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Medical Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.dicom"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB) asd
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="title">Record Title *</Label>
              <Input
                id="title"
                value={recordTitle}
                onChange={(e) => setRecordTitle(e.target.value)}
                placeholder="e.g., Blood Test Results"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={recordDescription}
              onChange={(e) => setRecordDescription(e.target.value)}
              placeholder="Brief description of the medical record..."
              rows={3}
            />
          </div>

          <Button onClick={handleUpload} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload to IPFS
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Your Medical Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicalRecords.map((record: any)  => (
              <div key={record.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{record.title}</h3>
                      <Badge className={getFileTypeColor(record.fileType)}>
                        {record.fileType}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{record.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Uploaded: {record.uploadDate}</span>
                      <span>Size: {record.size}</span>
                      <span>IPFS: {record.ipfsHash.substring(0, 12)}...</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewFile(record.ipfsHash)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewFile(record.ipfsHash)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordUpload;
