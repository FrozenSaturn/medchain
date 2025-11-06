import React from "react";
import RAGChatbot from "../rag-chatbot";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your medical dashboard. Use the AI assistant below to get
          insights about patient data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-muted-foreground">
                  Total Patients
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-muted-foreground">
                  Active Appointments
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">15</div>
                <div className="text-sm text-muted-foreground">
                  Medical Records
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-sm text-muted-foreground">
                  Pending Diagnoses
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">New appointment scheduled</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  2 min ago
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Diagnosis submitted</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  15 min ago
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Medical record uploaded</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  1 hour ago
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <RAGChatbot />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
