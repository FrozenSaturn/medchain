
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CreditCard, Award, CheckCircle } from 'lucide-react';

const MintManageAppointmentsTile = () => {
  // TODO: Fetch appointments with payment and diagnosis status from Supabase
  const appointments = [
    {
      id: 'APT001',
      bookingId: 'BK-2024-001',
      patientName: 'John Smith',
      doctorName: 'Dr. Sarah Johnson',
      status: 'diagnosis_submitted',
      paymentStatus: 'paid',
      canMintNFT: true,
      nftMinted: false
    },
    {
      id: 'APT002',
      bookingId: 'BK-2024-002',
      patientName: 'Sarah Wilson',
      doctorName: 'Dr. Michael Chen',
      status: 'pending',
      paymentStatus: 'not_paid',
      canMintNFT: false,
      nftMinted: false
    },
    {
      id: 'APT003',
      bookingId: 'BK-2024-003',
      patientName: 'Mike Johnson',
      doctorName: 'Dr. Emily Davis',
      status: 'completed',
      paymentStatus: 'paid',
      canMintNFT: false,
      nftMinted: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'Pending', variant: 'secondary' as const, color: 'text-yellow-600' },
      'paid': { label: 'Paid', variant: 'default' as const, color: 'text-green-600' },
      'diagnosis_submitted': { label: 'Diagnosis Submitted', variant: 'outline' as const, color: 'text-blue-600' },
      'completed': { label: 'Completed', variant: 'default' as const, color: 'text-green-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const, color: 'text-gray-600' };
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    return paymentStatus === 'paid' 
      ? <Badge variant="default" className="text-xs bg-green-100 text-green-800">Paid</Badge>
      : <Badge variant="destructive" className="text-xs">Not Paid</Badge>;
  };

  const handleMintNFT = (appointmentId: string) => {
    // TODO: Integrate with smart contract to mint medical NFT
    // TODO: Update appointment status in Supabase
    console.log(`Minting NFT for appointment: ${appointmentId}`);
  };

  const handleMarkCompleted = (appointmentId: string) => {
    // TODO: Update appointment status to completed in Supabase
    console.log(`Marking appointment as completed: ${appointmentId}`);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Mint & Manage Appointments</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {appointments.slice(0, 3).map((appointment) => (
            <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{appointment.bookingId}</h4>
                  <p className="text-xs text-gray-600">{appointment.patientName} • {appointment.doctorName}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  {getStatusBadge(appointment.status)}
                  {getPaymentBadge(appointment.paymentStatus)}
                </div>
              </div>
              
              <div className="flex space-x-2 mt-3">
                {appointment.canMintNFT && !appointment.nftMinted && (
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="flex-1 text-xs"
                    onClick={() => handleMintNFT(appointment.id)}
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Mint NFT
                  </Button>
                )}
                {appointment.status !== 'completed' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={() => handleMarkCompleted(appointment.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark Complete
                  </Button>
                )}
                {appointment.nftMinted && (
                  <div className="flex-1 flex items-center justify-center text-xs text-green-600">
                    <Award className="h-3 w-3 mr-1" />
                    NFT Minted
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div className="text-center text-xs text-gray-500">
            {appointments.length} total appointments managed
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Appointments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MintManageAppointmentsTile;
