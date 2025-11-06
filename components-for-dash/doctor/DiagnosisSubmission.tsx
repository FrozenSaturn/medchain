"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contracts";

interface Appointment {
  id: string;
}

interface AppointmentDetails {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  consultation_fee: number;
  patient_full_name?: string | null;
  patient_wallet_address?: string | null;
  doctor_full_name?: string | null;
  doctor_wallet_address?: string | null;
}

export function DiagnosisSubmission() {
  const [selectedAppointment, setSelectedAppointment] = React.useState("");
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [appointmentDetails, setAppointmentDetails] =
    React.useState<AppointmentDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);
  const [diagnosis, setDiagnosis] = React.useState("");
  const [treatmentPlan, setTreatmentPlan] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [tokenUri, setTokenUri] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isTransferring, setIsTransferring] = React.useState(false);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("appointments").select("id");

      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        setAppointments(data as Appointment[]);
      }
    };

    fetchAppointments();
  }, []);

  React.useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (selectedAppointment) {
        setIsLoadingDetails(true);
        setAppointmentDetails(null);
        const supabase = createClient();
        const { data: apptData, error: apptError } = await supabase
          .from("appointments")
          .select(
            "id, patient_id, doctor_id, appointment_date, consultation_fee"
          )
          .eq("id", selectedAppointment)
          .single();

        if (apptError) {
          console.error("Error fetching appointment details:", apptError);
          setIsLoadingDetails(false);
          return;
        }

        const { patient_id, doctor_id } = apptData;

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select('id, full_name, "walletAddress"')
          .in("id", [patient_id, doctor_id]);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          setAppointmentDetails(apptData);
        } else {
          const patientProfile = profilesData.find((p) => p.id === patient_id);
          const doctorProfile = profilesData.find((p) => p.id === doctor_id);

          setAppointmentDetails({
            ...apptData,
            patient_full_name: patientProfile?.full_name,
            patient_wallet_address: patientProfile?.walletAddress,
            doctor_full_name: doctorProfile?.full_name,
            doctor_wallet_address: doctorProfile?.walletAddress,
          });
        }
        setIsLoadingDetails(false);
      } else {
        setAppointmentDetails(null);
      }
    };

    fetchAppointmentDetails();
  }, [selectedAppointment]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      const url = result.tokenUri;
      setTokenUri(url);
      console.log("File uploaded successfully. Token URI:", url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const { writeContractAsync } = useWriteContract();

  const handleTransferToAdmin = async () => {
    if (
      !selectedAppointment ||
      !appointmentDetails?.patient_wallet_address ||
      !appointmentDetails?.doctor_wallet_address ||
      !diagnosis ||
      !treatmentPlan ||
      !tokenUri
    ) {
      alert(
        "Please ensure an appointment is selected, all details are loaded, diagnosis and treatment are filled, and the file is uploaded."
      );
      return;
    }

    setIsTransferring(true);
    try {
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mintNFT",
        args: [appointmentDetails.patient_wallet_address, tokenUri],
      });

      console.log("Mint transaction hash:", txHash);

      const supabase = createClient();
      const newRecord = {
        appointment_id: selectedAppointment,
        patient_wallet_address: appointmentDetails.patient_wallet_address,
        doctor_wallet_address: appointmentDetails.doctor_wallet_address,
        diagnosis: diagnosis,
        treatment: treatmentPlan,
        token_uri: tokenUri,
      };

      const { error } = await supabase
        .from("medical_records_nfts")
        .insert([newRecord]);

      if (error) {
        throw error;
      }

      alert("Record transferred to admin successfully!");
      // Optionally, reset the form here
    } catch (error) {
      console.error("Error transferring record to admin:", error);
      alert("Failed to transfer record. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Diagnosis and Treatment Plan</CardTitle>
        <CardDescription>
          Select an appointment, provide diagnosis and treatment, and upload any
          relevant files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="appointment">Select Appointment</Label>
            <Select
              onValueChange={setSelectedAppointment}
              value={selectedAppointment}
            >
              <SelectTrigger id="appointment">
                <SelectValue placeholder="Select an appointment" />
              </SelectTrigger>
              <SelectContent>
                {appointments.map((appointment) => (
                  <SelectItem key={appointment.id} value={appointment.id}>
                    {appointment.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoadingDetails && (
            <p className="text-sm text-muted-foreground">Loading details...</p>
          )}

          {appointmentDetails && !isLoadingDetails && (
            <Card className="bg-muted/40">
              <CardHeader>
                <CardTitle className="text-lg">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex flex-col col-span-2">
                  <span className="font-semibold">Patient:</span>
                  <span>{appointmentDetails.patient_full_name || "N/A"}</span>
                  <span className="text-xs text-muted-foreground">
                    {appointmentDetails.patient_wallet_address ||
                      "No wallet address"}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="font-semibold">Doctor:</span>
                  <span>{appointmentDetails.doctor_full_name || "N/A"}</span>
                  <span className="text-xs text-muted-foreground">
                    {appointmentDetails.doctor_wallet_address ||
                      "No wallet address"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Appointment Date:</span>
                  <span>
                    {new Date(
                      appointmentDetails.appointment_date
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Consultation Fee:</span>
                  <span>${appointmentDetails.consultation_fee}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter diagnosis here..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="treatment">Treatment Plan</Label>
            <Textarea
              id="treatment"
              placeholder="Enter treatment plan here..."
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          {tokenUri && (
            <div className="mt-2 text-sm text-green-600">
              <p>File uploaded successfully!</p>
              <p>
                URL:{" "}
                <a
                  href={tokenUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all"
                >
                  {tokenUri}
                </a>
              </p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
        <Button
          onClick={handleTransferToAdmin}
          disabled={isTransferring || !tokenUri}
          variant="secondary"
        >
          {isTransferring ? "Transferring..." : "Transfer to Admin"}
        </Button>
      </CardFooter>
    </Card>
  );
}
