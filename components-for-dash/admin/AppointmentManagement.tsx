"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, User, CreditCard, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // TODO: Fetch all appointments from Supabase
  const appointments = [
    {
      id: 'APT001',
      bookingId: 'BK-2024-001',
      patient: 'John Doe',
      doctor: 'Dr. Sarah Johnson',
      hospital: 'City General Hospital',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'diagnosis_completed',
      reason: 'Regular checkup',
      paymentStatus: 'pending'
    },
    {
      id: 'APT002',
      bookingId: 'BK-2024-002',
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Chen',
      hospital: 'Metro Medical Center',
      date: '2024-01-19',
      time: '2:00 PM',
      status: 'diagnosis_completed',
      reason: 'Headache consultation',
      paymentStatus: 'pending'
    },
    {
      id: 'APT003',
      bookingId: 'BK-2024-003',
      patient: 'Michael Johnson',
      doctor: 'Dr. Emily Rodriguez',
      hospital: 'Sunshine Clinic',
      date: '2024-01-18',
      time: '11:30 AM',
      status: 'payment_completed',
      reason: 'Skin examination',
      paymentStatus: 'paid',
      paymentAmount: 150,
      transactionHash: '0x1a2b3c4d5e6f7g8h9i0j...'
    },
    {
      id: 'APT004',
      bookingId: 'BK-2024-004',
      patient: 'Sarah Davis',
      doctor: 'Dr. James Wilson',
      hospital: 'Sports Medicine Center',
      date: '2024-01-17',
      time: '9:00 AM',
      status: 'nft_minted',
      reason: 'Knee injury follow-up',
      paymentStatus: 'paid',
      paymentAmount: 200,
      nftTokenId: '1001'
    }
  ];

  const handleRequestPayment = async (appointmentId: string, amount = 150) => {
    // TODO: Create payment request in Supabase
    // const { error } = await supabase
    //   .from('payment_requests')
    //   .insert({
    //     appointment_id: appointmentId,
    //     amount: amount,
    //     status: 'pending',
    //     created_by: admin.id,
    //     created_at: new Date().toISOString()
    //   });

    // TODO: Update appointment status
    // await supabase
    //   .from('appointments')
    //   .update({ payment_status: 'requested' })
    //   .eq('id', appointmentId);

    toast({
      title: "Payment Requested",
      description: `Payment request of $${amount} has been sent to the patient.`,
    });
  };

  const handleMintNFT = async (appointmentId: string, bookingId: string) => {
    // TODO: Mint NFT on blockchain with appointment data
    // 1. Gather all appointment and diagnosis data
    // 2. Upload metadata to IPFS
    // 3. Mint NFT with booking hash
    // const tokenId = await mintMedicalNFT({
    //   bookingId,
    //   patientId,
    //   doctorId,
    //   treatmentData,
    //   ipfsMetadataHash
    // });

    // TODO: Update appointment status
    // await supabase
    //   .from('appointments')
    //   .update({ 
    //     status: 'nft_minted',
    //     nft_token_id: tokenId
    //   })
    //   .eq('id', appointmentId);

    toast({
      title: "NFT Minted",
      description: `Medical NFT has been minted for booking ${bookingId}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'booked': { label: 'Booked', variant: 'secondary' },
      'in_progress': { label: 'In Progress', variant: 'default' },
      'diagnosis_completed': { label: 'Diagnosis Complete', variant: 'default' },
      'payment_completed': { label: 'Payment Complete', variant: 'default' },
      'nft_minted': { label: 'NFT Minted', variant: 'outline' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const statusConfig = {
      'pending': { label: 'Payment Pending', variant: 'destructive' },
      'paid': { label: 'Paid', variant: 'default' }
    };
    
    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || { label: paymentStatus, variant: 'secondary' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesDate = dateFilter === 'all' || appointment.date.includes(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Global Appointment Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient, doctor, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="diagnosis_completed">Diagnosis Complete</SelectItem>
                  <SelectItem value="payment_completed">Payment Complete</SelectItem>
                  <SelectItem value="nft_minted">NFT Minted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2024-01-20">Today</SelectItem>
                  <SelectItem value="2024-01-19">Yesterday</SelectItem>
                  <SelectItem value="2024-01">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredAppointments.map(appointment => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{appointment.patient}</h3>
                    {getStatusBadge(appointment.status)}
                    {getPaymentBadge(appointment.paymentStatus)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Doctor: {appointment.doctor}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                      <p><strong>Hospital:</strong> {appointment.hospital}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Booking ID:</strong> {appointment.bookingId}</p>
                      <p><strong>Reason:</strong> {appointment.reason}</p>
                      {appointment.paymentAmount && (
                        <p><strong>Amount:</strong> ${appointment.paymentAmount}</p>
                      )}
                      {appointment.nftTokenId && (
                        <p><strong>NFT Token:</strong> #{appointment.nftTokenId}</p>
                      )}
                      {appointment.transactionHash && (
                        <p><strong>Tx Hash:</strong> {appointment.transactionHash.substring(0, 20)}...</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 space-y-2">
                  {appointment.status === 'diagnosis_completed' && appointment.paymentStatus === 'pending' && (
                    <Button 
                      onClick={() => handleRequestPayment(appointment.id)}
                      size="sm"
                      className="w-full"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Request Payment
                    </Button>
                  )}
                  
                  {appointment.status === 'payment_completed' && appointment.paymentStatus === 'paid' && !appointment.nftTokenId && (
                    <Button 
                      onClick={() => handleMintNFT(appointment.id, appointment.bookingId)}
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mint NFT
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentManagement;
