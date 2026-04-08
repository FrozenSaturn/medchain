"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  Calendar,
  Stethoscope,
  Pill,
  Shield,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { doctorSpecialtyFromProfile } from "@/lib/doctor-profile";

interface MedicalRecord {
  id: string;
  appointment_id: string;
  patient_wallet_address: string;
  doctor_wallet_address: string;
  diagnosis: string | null;
  treatment: string | null;
  token_uri: string;
  created_at: string;
  appointment?: {
    appointment_date: string;
    reason: string;
    doctor: {
      full_name: string;
      bio: string | null;
    } | null;
  } | null;
}

interface PatientUploadedRecord {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_size_bytes: number | null;
  processing_status: string;
  ai_summary: string | null;
  error_message: string | null;
  created_at: string;
}

interface MedicalRecordUploadProps {
  userId: string | null;
  walletAddress: string | null;
}

const MedicalRecordUpload = ({
  userId,
  walletAddress,
}: MedicalRecordUploadProps) => {
  const [chainRecords, setChainRecords] = useState<MedicalRecord[]>([]);
  const [uploadedRecords, setUploadedRecords] = useState<
    PatientUploadedRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordTitle, setRecordTitle] = useState("");
  const [recordDescription, setRecordDescription] = useState("");

  const supabase = createClient();

  const fetchChainRecords = useCallback(async () => {
    if (!walletAddress) {
      setChainRecords([]);
      return;
    }
    const { data, error } = await supabase
      .from("medical_records_nfts")
      .select(
        `id, appointment_id, patient_wallet_address, doctor_wallet_address,
         diagnosis, treatment, token_uri, created_at,
         appointment:appointment_id(appointment_date, reason, doctor:doctor_id(full_name, bio))`
      )
      .eq("patient_wallet_address", walletAddress)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching on-chain records:", error);
      return;
    }
    setChainRecords((data as unknown as MedicalRecord[]) || []);
  }, [supabase, walletAddress]);

  const fetchUploadedRecords = useCallback(async () => {
    if (!userId) {
      setUploadedRecords([]);
      return;
    }
    const { data, error } = await supabase
      .from("patient_uploaded_records")
      .select(
        "id, title, description, file_name, file_size_bytes, processing_status, ai_summary, error_message, created_at"
      )
      .eq("patient_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching uploaded records:", error);
      return;
    }
    setUploadedRecords((data as PatientUploadedRecord[]) || []);
  }, [supabase, userId]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchChainRecords(), fetchUploadedRecords()]);
    setLoading(false);
  }, [fetchChainRecords, fetchUploadedRecords]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast({
          title: "PDF only",
          description: "Please choose a PDF file.",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to upload records.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedFile || !recordTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a PDF and enter a title.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("title", recordTitle.trim());
      if (recordDescription.trim()) {
        form.append("description", recordDescription.trim());
      }

      const res = await fetch("/api/patient-records/upload", {
        method: "POST",
        body: form,
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({
          title: "Upload failed",
          description:
            typeof payload.error === "string"
              ? payload.error
              : "Could not process this file.",
          variant: "destructive",
        });
        await fetchUploadedRecords();
        return;
      }

      if (payload.processing_status === "error") {
        toast({
          title: "Saved with errors",
          description:
            payload.error_message ||
            "The file was stored but summarization failed.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Record processed",
          description:
            "PDF text was extracted and summarized. It is available to the health assistant.",
        });
      }

      setSelectedFile(null);
      setRecordTitle("");
      setRecordDescription("");
      await fetchUploadedRecords();
    } catch (e) {
      console.error(e);
      toast({
        title: "Upload failed",
        description: "Network or server error. Try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const truncateAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#388E3C] mr-3" />
            <p className="text-[#FAFAFA]/70">Loading medical records...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#FAFAFA]">
            <Upload className="h-5 w-5 text-[#388E3C]" />
            <span>Upload medical record (PDF)</span>
          </CardTitle>
          <p className="text-sm text-[#FAFAFA]/60">
            Text is extracted with{" "}
            <span className="text-[#FAFAFA]/80">unpdf</span> (open-source PDF.js).
            A hosted <span className="text-[#FAFAFA]/80">Gemma</span> model summarizes
            it (default gemma-3-1b-it; override with GEMINI_RECORD_SUMMARY_MODEL). Chat
            uses Gemma 4 by default (gemma-4-31b-it; GEMINI_CHAT_MODEL).
            Summaries are stored for this account and used by the AI assistant.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!userId && (
            <p className="text-sm text-amber-200/90">
              Sign in to upload documents linked to your profile.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file" className="text-[#FAFAFA]/80">
                PDF file
              </Label>
              <Input
                id="file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileSelect}
                disabled={!userId || uploading}
                className="bg-black/30 border-[#388E3C]/30 text-[#FAFAFA]"
              />
              {selectedFile && (
                <p className="text-sm text-[#FAFAFA]/60 mt-1">
                  {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title" className="text-[#FAFAFA]/80">
                Title *
              </Label>
              <Input
                id="title"
                value={recordTitle}
                onChange={(e) => setRecordTitle(e.target.value)}
                placeholder="e.g., Lab results March 2026"
                disabled={!userId || uploading}
                className="bg-black/30 border-[#388E3C]/30 text-[#FAFAFA] placeholder:text-[#FAFAFA]/40"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-[#FAFAFA]/80">
              Notes (optional)
            </Label>
            <Textarea
              id="description"
              value={recordDescription}
              onChange={(e) => setRecordDescription(e.target.value)}
              placeholder="Any context for you or your doctor…"
              rows={3}
              disabled={!userId || uploading}
              className="bg-black/30 border-[#388E3C]/30 text-[#FAFAFA] placeholder:text-[#FAFAFA]/40"
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!userId || uploading}
            className="w-full bg-[#388E3C] hover:bg-[#388E3C]/80 text-[#FAFAFA]"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Extracting & summarizing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Upload and generate summary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#388E3C]/5 border-[#388E3C]/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#FAFAFA]">
            <Sparkles className="h-5 w-5 text-[#388E3C]" />
            <span>Your uploaded documents</span>
          </CardTitle>
          <p className="text-sm text-[#FAFAFA]/60">
            PDFs you uploaded; AI summaries are private to your account.
          </p>
        </CardHeader>
        <CardContent>
          {!userId ? (
            <p className="text-center text-[#FAFAFA]/50 py-8">
              Sign in to see uploaded documents.
            </p>
          ) : uploadedRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-[#388E3C]/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#FAFAFA]">
                No uploads yet
              </h3>
              <p className="text-[#FAFAFA]/60">
                Upload a PDF above to extract text and generate a summary.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="border border-[#388E3C]/20 rounded-lg p-4 hover:border-[#388E3C]/40 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[#FAFAFA]">
                          {rec.title}
                        </h3>
                        {rec.processing_status === "ready" && (
                          <Badge className="bg-[#388E3C]/20 text-[#388E3C] border-[#388E3C]/30 text-xs">
                            Ready
                          </Badge>
                        )}
                        {rec.processing_status === "error" && (
                          <Badge
                            variant="destructive"
                            className="text-xs flex items-center gap-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Error
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#FAFAFA]/50">
                        {rec.file_name}
                        {rec.file_size_bytes != null &&
                          ` · ${(rec.file_size_bytes / 1024).toFixed(1)} KB`}{" "}
                        · {formatDate(rec.created_at)}
                      </p>
                      {rec.description && (
                        <p className="text-sm text-[#FAFAFA]/70">{rec.description}</p>
                      )}
                      {rec.ai_summary && (
                        <div className="bg-[#388E3C]/10 p-3 rounded-md mt-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Sparkles className="h-3 w-3 text-[#388E3C]" />
                            <span className="text-xs font-semibold text-[#388E3C]">
                              AI summary (Gemma / Gemini)
                            </span>
                          </div>
                          <pre className="text-sm text-[#FAFAFA]/85 whitespace-pre-wrap font-sans">
                            {rec.ai_summary}
                          </pre>
                        </div>
                      )}
                      {rec.processing_status === "error" && rec.error_message && (
                        <p className="text-sm text-red-300/90">{rec.error_message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2 text-xs text-[#FAFAFA]/50 px-1">
        <Shield className="h-3 w-3 text-[#388E3C]" />
        <span>
          Uploads are tied to your account for the assistant. On-chain records
          remain separate. This is not a substitute for professional care.
        </span>
      </div>
    </div>
  );
};

export default MedicalRecordUpload;
