"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Search, Check, X, FileText, User, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CONTRACT_ABI2, CONTRACT_ADDRESS2 } from '@/lib/contracts2'
import { useReadContract, useAccount, useWriteContract } from 'wagmi'

// This interface is based on what the component needs, mapped from the 'profiles' table
interface RoleRequest {
  id: string; // profile.id
  userId: string; // profile.id
  name: string;
  walletAddress: string | null;
  currentRole: string; // Will be hardcoded to 'patient' for display
  requestedRole: 'doctor';
  specialization: string | null;
  consultation_fee: number | null;
  bio: string | null;
  requestDate: string;
  status: 'pending'; // All fetched requests are pending
  documents: string[]; // This is not in the db, will be an empty array
}

const RoleVerification = () => {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const supabase = createClient();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    const fetchRoleRequests = async () => {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .eq('verified', false);

      if (error) {
        toast({
          title: "Error fetching requests",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error fetching role requests:", error);
      } else if (profiles) {
        const mappedRequests: RoleRequest[] = profiles.map(profile => ({
          id: profile.id,
          userId: profile.id,
          name: profile.full_name || 'Unnamed User',
          walletAddress: profile.walletAddress,
          currentRole: 'patient',
          requestedRole: 'doctor',
          specialization: profile.specialization,
          consultation_fee: profile.consultation_fee,
          bio: profile.bio,
          requestDate: new Date(profile.updated_at).toLocaleDateString(),
          status: 'pending',
          documents: [], // Placeholder as this is not in the profiles table
        }));
        setRequests(mappedRequests);
      }
      setLoading(false);
    };

    fetchRoleRequests();
  }, [supabase]);

  const handleApprove = async (userId: string, walletAddress: string | null) => {
    if (!walletAddress) {
      toast({
        title: "Approval Failed",
        description: "User does not have a wallet address to add to the contract.",
        variant: "destructive",
      });
      return;
    }
    setProcessingId(userId);
    try {
      // Step 1: Call the smart contract to add the doctor
      await writeContractAsync({
        address: CONTRACT_ADDRESS2,
        abi: CONTRACT_ABI2,
        functionName: 'addDoctor',
        args: [walletAddress],
      });

      toast({
        title: "Transaction Sent",
        description: "Adding doctor to the smart contract. Please wait for confirmation.",
      });

      // Step 2: Update Supabase database to mark as verified
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ verified: true, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (dbError) {
        // Handle case where blockchain succeeded but DB failed
        toast({
          title: "Database Update Failed",
          description: `The user was added on-chain, but the database update failed: ${dbError.message}. Please update manually.`,
          variant: "destructive",
        });
        throw dbError;
      }

      toast({
        title: "Role Approved",
        description: `User has been verified as a doctor on-chain and in the database.`,
      });
      setRequests(prev => prev.filter(req => req.userId !== userId));

    } catch (error: any) {
      console.error("Approval process failed:", error);
      toast({
        title: "Approval Failed",
        description: error.message || "An error occurred during the approval process.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'patient', verified: false, specialization: null, consultation_fee: null, bio: null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Role Request Rejected",
        description: "The user's role has been reverted to patient.",
        variant: "destructive"
      });
      setRequests(prev => prev.filter(req => req.userId !== userId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'Pending Review', variant: 'destructive' },
      'approved': { label: 'Approved', variant: 'default' },
      'rejected': { label: 'Rejected', variant: 'secondary' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'doctor': { label: 'Doctor', variant: 'default' },
      'hospital': { label: 'Hospital', variant: 'secondary' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: 'outline' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.walletAddress && request.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || request.requestedRole === roleFilter;
    const matchesStatus = statusFilter === 'all' || request.status === 'pending';

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Role Verification Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredRequests.map((request: RoleRequest) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{request.name}</h3>
                    {getRoleBadge(request.requestedRole)}
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Wallet Address:</strong> {request.walletAddress || 'N/A'}</p>
                      <p><strong>Current Role:</strong> {request.currentRole}</p>
                      <p><strong>Request Date:</strong> {request.requestDate}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <>
                        <p><strong>Specialization:</strong> {request.specialization || 'N/A'}</p>
                        <p><strong>Consultation Fee:</strong> ${request.consultation_fee ? request.consultation_fee.toFixed(2) : 'N/A'}</p>
                        <p><strong>Bio:</strong> {request.bio || 'N/A'}</p>
                      </>
                      <div>
                        <strong>Documents:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {request.documents.length > 0 ? request.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span>{doc}</span>
                            </Badge>
                          )) : <span className='text-gray-500 text-xs'>No documents</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="ml-6 space-y-2">
                    <Button
                      onClick={() => handleApprove(request.userId, request.walletAddress)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={processingId === request.userId}
                    >
                      {processingId === request.userId ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(request.userId)}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Review Docs
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending role requests found</h3>
            <p className="text-gray-600">All doctor verification requests have been processed.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleVerification;
