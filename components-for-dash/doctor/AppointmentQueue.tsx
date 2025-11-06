"use client";
import React, { useState, useEffect } from "react";
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
import {
  Calendar,
  Clock,
  User,
  FileText,
  Search,
  Loader2,
  Award,
  ExternalLink,
  Download,
  Wallet,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  patientAge: number;
  time: string;
  status: string;
  reason: string;
  symptoms: string;
  lastVisit: string;
}

interface MedicalNFT {
  id: string;
  appointment_id: string;
  patient_wallet_address: string;
  doctor_wallet_address: string;
  diagnosis: string | null;
  treatment: string | null;
  token_uri: string;
}

const AppointmentQueue = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [patientNFTs, setPatientNFTs] = useState<MedicalNFT[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const supabase = createClient();

  // Fetch appointments with patient data from Supabase
  const fetchAppointments = async () => {
    try {
      // First, get appointments
      const { data: appointmentsData, error: appointmentsError } =
        await supabase
          .from("appointments")
          .select("id, patient_id, appointment_date")
          .limit(10);

      if (appointmentsError) {
        throw new Error("Failed to fetch appointments");
      }

      if (!appointmentsData || appointmentsData.length === 0) {
        setAppointments([]);
        return;
      }

      // Get patient IDs
      const patientIds = appointmentsData.map((apt) => apt.patient_id);

      // Then, get patient names from profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", patientIds);

      if (profilesError) {
        throw new Error("Failed to fetch patient profiles");
      }

      // Create a map of patient ID to name
      const patientNameMap = new Map();
      if (profilesData) {
        profilesData.forEach((profile) => {
          patientNameMap.set(profile.id, profile.full_name);
        });
      }

      // Hardcoded data for demonstration
      const hardcodedData = [
        {
          patientAge: 45,
          time: "10:00 AM",
          status: "booked",
          reason: "Regular checkup",
          symptoms: "Chest discomfort, shortness of breath",
          lastVisit: "2023-12-15",
        },
        {
          patientAge: 32,
          time: "11:00 AM",
          status: "booked",
          reason: "Follow-up consultation",
          symptoms: "Palpitations, anxiety",
          lastVisit: "2024-01-05",
        },
        {
          patientAge: 58,
          time: "2:00 PM",
          status: "awaiting_diagnosis",
          reason: "Chest pain evaluation",
          symptoms: "Severe chest pain, radiating to left arm",
          lastVisit: "First visit",
        },
        {
          patientAge: 28,
          time: "3:30 PM",
          status: "booked",
          reason: "Annual physical",
          symptoms: "Fatigue, weight loss",
          lastVisit: "2023-11-20",
        },
        {
          patientAge: 67,
          time: "4:15 PM",
          status: "awaiting_diagnosis",
          reason: "Diabetes management",
          symptoms: "Increased thirst, frequent urination",
          lastVisit: "2024-01-10",
        },
        {
          patientAge: 41,
          time: "9:00 AM",
          status: "booked",
          reason: "Blood pressure check",
          symptoms: "Headaches, dizziness",
          lastVisit: "2023-12-28",
        },
        {
          patientAge: 53,
          time: "1:45 PM",
          status: "completed",
          reason: "Post-surgery follow-up",
          symptoms: "Healing well, mild discomfort",
          lastVisit: "2024-01-15",
        },
        {
          patientAge: 35,
          time: "5:00 PM",
          status: "booked",
          reason: "Allergy consultation",
          symptoms: "Seasonal allergies, runny nose",
          lastVisit: "2023-10-15",
        },
        {
          patientAge: 49,
          time: "8:30 AM",
          status: "awaiting_diagnosis",
          reason: "Back pain evaluation",
          symptoms: "Lower back pain, limited mobility",
          lastVisit: "2024-01-08",
        },
        {
          patientAge: 62,
          time: "12:30 PM",
          status: "booked",
          reason: "Heart health check",
          symptoms: "Irregular heartbeat, fatigue",
          lastVisit: "2023-11-30",
        },
      ];

      // Combine the data
      const transformedAppointments: Appointment[] = appointmentsData.map(
        (apt, index) => {
          const hardcoded = hardcodedData[index % hardcodedData.length];
          return {
            id: apt.id,
            patient_id: apt.patient_id,
            patient_name:
              patientNameMap.get(apt.patient_id) || "Unknown Patient",
            appointment_date: apt.appointment_date || "2024-01-20",
            patientAge: hardcoded.patientAge,
            time: hardcoded.time,
            status: hardcoded.status,
            reason: hardcoded.reason,
            symptoms: hardcoded.symptoms,
            lastVisit: hardcoded.lastVisit,
          };
        }
      );

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient's medical NFTs
  const fetchPatientRecords = async (patientId: string) => {
    setRecordsLoading(true);
    try {
      // First get the patient's wallet address
      const { data: patientProfile, error: profileError } = await supabase
        .from("profiles")
        .select("walletAddress")
        .eq("id", patientId)
        .single();

      if (profileError || !patientProfile?.walletAddress) {
        throw new Error("Patient wallet address not found");
      }

      // Then get NFTs for this patient's wallet
      const { data: nfts, error: nftsError } = await supabase
        .from("medical_records_nfts")
        .select("*")
        .eq("patient_wallet_address", patientProfile.walletAddress);

      if (nftsError) {
        throw new Error("Failed to fetch patient records");
      }

      setPatientNFTs(nfts || []);
    } catch (error) {
      console.error("Error fetching patient records:", error);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive",
      });
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleViewRecords = async (
    patientId: string,
    appointmentId: string
  ) => {
    setSelectedPatientId(patientId);
    setShowRecordsModal(true);
    await fetchPatientRecords(patientId);
  };

  const handleStartConsultation = async (appointmentId: string) => {
    console.log(`Starting consultation for appointment ${appointmentId}`);
  };

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
      description: "Medical treatment certificate is being generated...",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const closeModal = () => {
    setShowRecordsModal(false);
    setSelectedPatientId("");
    setPatientNFTs([]);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge
            variant="default"
            className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"
          >
            Completed
          </Badge>
        );
      case "awaiting_diagnosis":
        return (
          <Badge
            variant="default"
            className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/30"
          >
            Awaiting Diagnosis
          </Badge>
        );
      case "booked":
        return (
          <Badge
            variant="default"
            className="bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30"
          >
            Booked
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="destructive"
            className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patient_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate =
      dateFilter === "all" || appointment.appointment_date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading appointments...</p>
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
              <Calendar className="h-16 w-16 mx-auto text-red-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Error Loading Appointments
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">
                        {appointment.patient_name}
                      </h3>
                      <Badge variant="outline">
                        Age {appointment.patientAge}
                      </Badge>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{appointment.appointment_date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Patient ID: {appointment.patient_id}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Reason:</strong> {appointment.reason}
                        </p>
                        <p>
                          <strong>Symptoms:</strong> {appointment.symptoms}
                        </p>
                        <p>
                          <strong>Last Visit:</strong> {appointment.lastVisit}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewRecords(
                          appointment.patient_id,
                          appointment.id
                        )
                      }
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Records
                    </Button>

                    {appointment.status === "booked" && (
                      <Button
                        size="sm"
                        onClick={() => handleStartConsultation(appointment.id)}
                        className="w-full"
                      >
                        Start Consultation
                      </Button>
                    )}

                    {appointment.status === "awaiting_diagnosis" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full"
                      >
                        Submit Diagnosis
                      </Button>
                    )}
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
              <h3 className="text-lg font-semibold mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Records Modal */}
      {showRecordsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">
                  Patient Medical Records
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="hover:bg-gray-200 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {recordsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                    <p className="text-gray-600">Loading patient records...</p>
                  </div>
                </div>
              ) : patientNFTs.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Medical Records Found
                    </h3>
                    <p className="text-gray-600">
                      This patient has no medical NFT records yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patientNFTs.map((nft) => (
                    <Card
                      key={nft.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={nft.token_uri}
                          alt={`Medical NFT ${nft.id}`}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.jpg";
                            target.onerror = null;
                          }}
                        />
                      </div>

                      <CardContent className="p-3">
                        <h3 className="font-semibold text-base mb-3">
                          Medical NFT Record
                        </h3>

                        <div className="space-y-1 text-xs">
                          <p>
                            <strong>ID:</strong> {nft.id}
                          </p>
                          <p>
                            <strong>Appointment ID:</strong>{" "}
                            {nft.appointment_id}
                          </p>
                          <p>
                            <strong>Patient Wallet:</strong>{" "}
                            {truncateAddress(nft.patient_wallet_address)}
                          </p>
                          <p>
                            <strong>Doctor Wallet:</strong>{" "}
                            {truncateAddress(nft.doctor_wallet_address)}
                          </p>
                          <p>
                            <strong>Token URI:</strong>{" "}
                            {nft.token_uri.substring(0, 20)}...
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

                        <div className="space-y-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => viewOnBlockchain(nft.token_uri)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Blockchain
                          </Button>

                          <div className="grid grid-cols-2 gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => viewMetadata(nft.token_uri)}
                            >
                              Metadata
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => downloadCertificate(nft)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentQueue;
