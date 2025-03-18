import React from 'react';
import { BarChart2 } from 'lucide-react';
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';

function Analytics() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Analytics Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BarChart2 size={64} className="mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-medium">Analytics Dashboard</h3>
              <p className="text-gray-400 mt-2">View your performance metrics here</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;