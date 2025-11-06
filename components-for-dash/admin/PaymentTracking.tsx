"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Search, ExternalLink, TrendingUp, DollarSign } from 'lucide-react';

const PaymentTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // TODO: Fetch payment data from Supabase and blockchain
  const payments = [
    {
      id: 'PAY001',
      bookingId: 'BK-2024-003',
      patient: 'Michael Johnson',
      doctor: 'Dr. Emily Rodriguez',
      amount: 150,
      requestDate: '2024-01-18',
      paymentDate: '2024-01-19',
      status: 'completed',
      transactionHash: '0x1a2b3c4d5e6f7g8h9i0j...',
      blockNumber: 18567432,
      gasUsed: '21000'
    },
    {
      id: 'PAY002',
      bookingId: 'BK-2024-004',
      patient: 'Sarah Davis',
      doctor: 'Dr. James Wilson',
      amount: 200,
      requestDate: '2024-01-17',
      paymentDate: '2024-01-18',
      status: 'completed',
      transactionHash: '0x9f8e7d6c5b4a3928171615...',
      blockNumber: 18567123,
      gasUsed: '21000'
    },
    {
      id: 'PAY003',
      bookingId: 'BK-2024-001',
      patient: 'John Doe',
      doctor: 'Dr. Sarah Johnson',
      amount: 120,
      requestDate: '2024-01-20',
      status: 'pending',
      daysOverdue: 1
    },
    {
      id: 'PAY004',
      bookingId: 'BK-2024-002',
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Chen',
      amount: 180,
      requestDate: '2024-01-19',
      status: 'pending',
      daysOverdue: 2
    }
  ];

  const paymentStats = {
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter(p => p.status === 'completed').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length
  };

  const handleViewTransaction = (transactionHash: string) => {
    // TODO: Open blockchain explorer
    window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank');
  };

  const getStatusBadge = (status: string, daysOverdue = 0) => {
    if (status === 'completed') {
      return <Badge variant="default" className="bg-green-600">Completed</Badge>;
    }
    
    if (status === 'pending') {
      const variant = daysOverdue > 3 ? 'destructive' : 'secondary';
      const label = daysOverdue > 0 ? `Overdue ${daysOverdue}d` : 'Pending';
      return <Badge variant={variant}>{label}</Badge>;
    }
    
    return <Badge variant="secondary">{status}</Badge>;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesPeriod = periodFilter === 'all' || 
                         (periodFilter === 'this_week' && new Date(payment.requestDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${paymentStats.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold">${paymentStats.pendingAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{paymentStats.completedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{paymentStats.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Tracking</span>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPayments.map(payment => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{payment.patient}</h3>
                    {getStatusBadge(payment.status, payment.daysOverdue)}
                    <Badge variant="outline" className="text-lg font-semibold">
                      ${payment.amount}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Doctor:</strong> {payment.doctor}</p>
                      <p><strong>Booking ID:</strong> {payment.bookingId}</p>
                      <p><strong>Request Date:</strong> {payment.requestDate}</p>
                      {payment.paymentDate && (
                        <p><strong>Payment Date:</strong> {payment.paymentDate}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {payment.transactionHash && (
                        <>
                          <p><strong>Transaction:</strong> {payment.transactionHash.substring(0, 20)}...</p>
                          <p><strong>Block:</strong> {payment.blockNumber}</p>
                          <p><strong>Gas Used:</strong> {payment.gasUsed}</p>
                        </>
                      )}
                      {payment.daysOverdue && payment.daysOverdue > 0 && (
                        <p className="text-red-600"><strong>Days Overdue:</strong> {payment.daysOverdue}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 space-y-2">
                  {payment.transactionHash && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTransaction(payment.transactionHash)}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Chain
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    View Details
                  </Button>
                  
                  {payment.status === 'pending' && (
                    <Button 
                      size="sm"
                      variant="secondary"
                      className="w-full"
                    >
                      Send Reminder
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentTracking;
