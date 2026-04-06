"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Search, Check, X, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CONTRACT_ABI2, CONTRACT_ADDRESS2 } from "@/lib/contracts2";
import { useWriteContract } from "wagmi";

interface ProfileRow {
  id: string;
  full_name: string | null;
  walletAddress?: string | null;
  bio: string | null;
  role: string | null;
  verified: boolean | null;
  specialization: string | null;
  consultation_fee: number | null;
  doctor_verification_pending: boolean | null;
  updated_at: string | null;
}

interface RoleRequest {
  id: string;
  userId: string;
  name: string;
  walletAddress: string | null;
  currentRole: string;
  requestedRole: "doctor";
  specialization: string | null;
  consultation_fee: number | null;
  bio: string | null;
  requestDate: string;
  status: "pending";
  documents: string[];
}

function mapProfileToRequest(profile: ProfileRow): RoleRequest {
  const w =
    profile.walletAddress ??
    (profile as { walletaddress?: string }).walletaddress ??
    null;
  return {
    id: profile.id,
    userId: profile.id,
    name: profile.full_name || "Unnamed User",
    walletAddress: w,
    currentRole: profile.role || "patient",
    requestedRole: "doctor",
    specialization: profile.specialization,
    consultation_fee: profile.consultation_fee,
    bio: profile.bio,
    requestDate: profile.updated_at
      ? new Date(profile.updated_at).toLocaleDateString()
      : "—",
    status: "pending",
    documents: [],
  };
}

const RoleVerification = () => {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const supabase = createClient();
  const { writeContractAsync } = useWriteContract();

  const fetchRoleRequests = useCallback(async () => {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        `id, full_name, bio, role, verified, specialization, consultation_fee,
         doctor_verification_pending, updated_at, "walletAddress"`
      )
      .or(
        "doctor_verification_pending.eq.true,and(role.eq.doctor,verified.eq.false)"
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching role requests:", error);
      toast({
        title: "Error fetching requests",
        description:
          error.message.includes("verified") ||
          error.message.includes("doctor_verification")
            ? "Run supabase_profiles_role_verification.sql in the Supabase SQL Editor to add missing columns."
            : error.message,
        variant: "destructive",
      });
      setRequests([]);
    } else if (profiles?.length) {
      setRequests(
        (profiles as ProfileRow[]).map((p) => mapProfileToRequest(p))
      );
    } else {
      setRequests([]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchRoleRequests();
  }, [fetchRoleRequests]);

  const handleApprove = async (userId: string, walletAddress: string | null) => {
    if (!walletAddress?.trim()) {
      toast({
        title: "Approval Failed",
        description:
          "User needs a wallet address on their profile for the on-chain doctor list.",
        variant: "destructive",
      });
      return;
    }
    setProcessingId(userId);
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS2,
        abi: CONTRACT_ABI2,
        functionName: "addDoctor",
        args: [walletAddress as `0x${string}`],
      });

      toast({
        title: "Transaction Sent",
        description:
          "Adding doctor on-chain. After it confirms, the profile will be updated.",
      });

      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          role: "doctor",
          verified: true,
          doctor_verification_pending: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (dbError) {
        toast({
          title: "Database Update Failed",
          description: `${dbError.message}. If the chain tx succeeded, set verified=true manually.`,
          variant: "destructive",
        });
        throw dbError;
      }

      toast({
        title: "Role Approved",
        description: "Doctor verified in the database. On-chain registration submitted.",
      });
      setRequests((prev) => prev.filter((req) => req.userId !== userId));
      await fetchRoleRequests();
    } catch (error: unknown) {
      console.error("Approval process failed:", error);
      const msg =
        error instanceof Error ? error.message : "Approval process failed.";
      toast({
        title: "Approval Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setProcessingId(userId);
    const { error } = await supabase
      .from("profiles")
      .update({
        role: "patient",
        verified: false,
        doctor_verification_pending: false,
        specialization: null,
        consultation_fee: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setProcessingId(null);

    if (error) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request rejected",
        description: "Profile reset to patient; application cleared.",
      });
      setRequests((prev) => prev.filter((req) => req.userId !== userId));
      await fetchRoleRequests();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending Review", variant: "destructive" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "secondary" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        variant: "secondary" as const,
      };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      doctor: { label: "Doctor", variant: "default" as const },
      hospital: { label: "Hospital", variant: "secondary" as const },
    };

    const config =
      roleConfig[role as keyof typeof roleConfig] || {
        label: role,
        variant: "outline" as const,
      };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.walletAddress &&
        request.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole =
      roleFilter === "all" || request.requestedRole === roleFilter;
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
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
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Role Verification Panel</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => fetchRoleRequests()}>
            Refresh
          </Button>
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredRequests.map((request: RoleRequest) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold leading-tight break-words">
                      {request.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {getRoleBadge(request.requestedRole)}
                      {getStatusBadge(request.status)}
                      <Badge variant="outline" className="text-xs font-normal">
                        DB role: {request.currentRole}
                      </Badge>
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">
                        Wallet address
                      </dt>
                      <dd className="break-all font-mono text-xs leading-relaxed">
                        {request.walletAddress || "N/A"}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">
                        Request date
                      </dt>
                      <dd>{request.requestDate}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">
                        Specialization
                      </dt>
                      <dd className="break-words">
                        {request.specialization || "N/A"}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">
                        Consultation fee
                      </dt>
                      <dd>
                        {request.consultation_fee != null
                          ? `$${Number(request.consultation_fee).toFixed(2)}`
                          : "N/A"}
                      </dd>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <dt className="font-medium text-muted-foreground">Bio</dt>
                      <dd className="break-words leading-relaxed">
                        {request.bio || "N/A"}
                      </dd>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <dt className="font-medium text-muted-foreground">
                        Documents
                      </dt>
                      <dd>
                        <div className="flex flex-wrap gap-2">
                          {request.documents.length > 0 ? (
                            request.documents.map((doc, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="inline-flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3 shrink-0" />
                                <span>{doc}</span>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              No documents
                            </span>
                          )}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>

                {request.status === "pending" && (
                  <div className="flex shrink-0 flex-col gap-2 border-t border-border pt-4 lg:w-44 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <Button
                      type="button"
                      onClick={() =>
                        handleApprove(request.userId, request.walletAddress)
                      }
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={processingId === request.userId}
                    >
                      {processingId === request.userId ? (
                        <Loader2 className="h-4 w-4 mr-2 shrink-0 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2 shrink-0" />
                      )}
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleReject(request.userId)}
                      className="w-full"
                      disabled={processingId === request.userId}
                    >
                      <X className="h-4 w-4 mr-2 shrink-0" />
                      Reject
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
          <CardContent className="p-8 text-center space-y-2">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No pending role requests
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              Patients submit an application from Account Settings → Profile
              (&quot;Apply for doctor verification&quot;). You can also seed a
              row with{" "}
              <code className="text-xs">
                doctor_verification_pending = true
              </code>{" "}
              in Supabase.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleVerification;
