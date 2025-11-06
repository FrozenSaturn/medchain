
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Check, X } from 'lucide-react';

const RoleRequestsTile = () => {
  // TODO: Fetch pending role requests from Supabase
  const roleRequests = [
    {
      id: 'REQ001',
      userName: 'Dr. Michael Chen',
      email: 'michael.chen@email.com',
      requestedRole: 'doctor',
      specialty: 'Dermatology',
      submittedAt: '2024-01-19',
      status: 'pending'
    },
    {
      id: 'REQ002',
      userName: 'Dr. Emily Davis',
      email: 'emily.davis@email.com',
      requestedRole: 'doctor',
      specialty: 'Pediatrics',
      submittedAt: '2024-01-18',
      status: 'pending'
    }
  ];

  const handleApproveDoctor = (requestId: string) => {
    // TODO: Integrate with Supabase to approve doctor role
    // TODO: Update user role in database
    // TODO: Potentially trigger on-chain transaction for role verification
    console.log(`Approving doctor request: ${requestId}`);
  };

  const handleRejectRequest = (requestId: string) => {
    // TODO: Integrate with Supabase to reject request
    console.log(`Rejecting request: ${requestId}`);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Shield className="h-5 w-5 text-red-600" />
          <span>Role Requests</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {roleRequests.slice(0, 2).map((request) => (
            <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{request.userName}</h4>
                <Badge variant="secondary" className="text-xs">
                  {request.requestedRole}
                </Badge>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600 mb-3">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3" />
                  <span>{request.specialty}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Requested: {request.submittedAt}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="flex-1 text-xs"
                  onClick={() => handleApproveDoctor(request.id)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs"
                  onClick={() => handleRejectRequest(request.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
          
          <div className="text-center text-xs text-gray-500">
            {roleRequests.length} pending role requests
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleRequestsTile;
