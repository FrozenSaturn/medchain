
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Clock, Paperclip } from 'lucide-react';

const DiagnosisSubmissionTile = () => {
  // TODO: Fetch recent diagnosis submissions from Supabase
  const recentSubmission = {
    id: 'DIAG001',
    patientName: 'John Smith',
    appointmentId: 'APT001',
    submittedAt: '2024-01-19',
    diagnosis: 'Hypertension - Stage 1',
    hasAttachment: true
  };

  const pendingDiagnoses = 3; // TODO: Fetch from Supabase

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <FileText className="h-5 w-5 text-green-600" />
          <span>Diagnosis Submission</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Recent Submission Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">Latest Submission</h4>
              <Badge variant="outline" className="text-xs">Completed</Badge>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <FileText className="h-3 w-3" />
                <span>{recentSubmission.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>Submitted: {recentSubmission.submittedAt}</span>
              </div>
              {recentSubmission.hasAttachment && (
                <div className="flex items-center space-x-2">
                  <Paperclip className="h-3 w-3" />
                  <span>Documents attached</span>
                </div>
              )}
            </div>
            
          </div>
          
          <div className="text-center text-xs text-gray-500">
            {pendingDiagnoses} appointments awaiting diagnosis
          </div>
        </div>
        
        <div className="pt-2 border-t space-y-2">
          <Button variant="default" className="w-full" size="sm">
            <Upload className="h-3 w-3 mr-2" />
            Submit New Diagnosis
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            View All Submissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosisSubmissionTile;
