import React, { useState } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Zap, Activity, Map, Terminal, ThermometerSnowflake } from 'lucide-react';

const AIAnalysisDashboard = () => {
  const [selectedHop, setSelectedHop] = useState(1);
  
  // Sample data for the charts
  const anomalyData = [
    { name: 'Hop 1', expected: 42, actual: 45, anomalyScore: 0.12 },
    { name: 'Hop 2', expected: 39, actual: 38, anomalyScore: 0.08 },
    { name: 'Hop 3', expected: 41, actual: 52, anomalyScore: 0.68 },
    { name: 'Destination', expected: 43, actual: 44, anomalyScore: 0.15 }
  ];
  
  const temperatureData = [
    { time: '08:15', value: 22.1 },
    { time: '08:30', value: 22.3 },
    { time: '08:45', value: 23.1 },
    { time: '09:00', value: 23.5 },
    { time: '09:15', value: 24.2 },
    { time: '09:30', value: 23.8 },
    { time: '09:45', value: 23.2 },
    { time: '10:00', value: 22.9 }
  ];
  
  const vibrationData = [
    { time: '08:15', value: 0.12 },
    { time: '08:30', value: 0.34 },
    { time: '08:45', value: 0.87 },
    { time: '09:00', value: 0.45 },
    { time: '09:15', value: 0.23 },
    { time: '09:30', value: 0.18 },
    { time: '09:45', value: 0.29 },
    { time: '10:00', value: 0.15 }
  ];
  
  const riskScoreData = [
    { name: 'Environmental', value: 15 },
    { name: 'Handling', value: 8 },
    { name: 'Routing', value: 5 },
    { name: 'Security', value: 2 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const hopDetails = [
    {
      hop: 1,
      anomalies: [
        { type: 'Temperature Spike', severity: 'Low', time: '08:42 AM', details: 'Brief temperature rise of 1.8°C detected, within acceptable limits' },
        { type: 'Unusual Delay', severity: 'Low', time: '08:55 AM', details: 'Package stationary for 7 minutes longer than expected route average' }
      ],
      aiInsights: 'Route conditions normal with minor deviations. Traffic patterns consistent with historical data. No significant anomalies detected.',
      confidence: 0.92,
      environmentalFactors: 'Temperature: 23.1°C (±1.2°C), Humidity: 68%, Light exposure: Normal',
      predictiveAnalysis: 'On track for delivery within estimated time window. No adjustments needed.'
    },
    {
      hop: 2,
      anomalies: [
        { type: 'Unusual Route', severity: 'Medium', time: '09:22 AM', details: 'Alternate route taken, 1.2km longer than optimal path' },
        { type: 'Vibration Alert', severity: 'Medium', time: '09:31 AM', details: 'Unusual vibration pattern detected for 45 seconds' }
      ],
      aiInsights: 'Alternate route likely taken due to traffic congestion on main route. Vibration pattern suggests rough road conditions.',
      confidence: 0.87,
      environmentalFactors: 'Temperature: 23.8°C (±0.9°C), Humidity: 65%, Light exposure: Normal',
      predictiveAnalysis: 'Estimated arrival adjusted by +3 minutes due to route change. Package integrity unaffected.'
    },
    {
      hop: 3,
      anomalies: [
        { type: 'Critical Delay', severity: 'High', time: '10:05 AM', details: 'Stationary for 12 minutes in non-designated area' },
        { type: 'Temperature Alert', severity: 'Medium', time: '10:08 AM', details: 'Temperature increased to 26.7°C for 8 minutes' }
      ],
      aiInsights: 'Unscheduled stop detected. Correlation with temperature rise suggests vehicle idling with direct sun exposure.',
      confidence: 0.79,
      environmentalFactors: 'Temperature: 25.2°C (±2.1°C), Humidity: 62%, Light exposure: Above normal',
      predictiveAnalysis: 'Delay impact analysis: Estimated arrival time adjusted by +9 minutes. Package integrity verified via sensor data.'
    }
  ];
  
  const selectedHopData = hopDetails.find(h => h.hop === selectedHop) || hopDetails[0];
  
  const severityColor = (severity) => {
    switch(severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI-Powered Analysis Dashboard</h1>
        <p className="text-gray-600">Package ID: PRD-3452-XY • RFID: RFID-123456788</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Anomaly Detection</h2>
            <AlertTriangle className="text-amber-500" size={24} />
          </div>
          <div className="h-64">
            <BarChart width={300} height={220} data={anomalyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="anomalyScore" fill="#8884d8" name="Anomaly Score" />
            </BarChart>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Environmental Monitoring</h2>
            <ThermometerSnowflake className="text-blue-500" size={24} />
          </div>
          <div className="h-64">
            <LineChart width={300} height={220} data={temperatureData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="Temperature (°C)" />
            </LineChart>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Vibration Analysis</h2>
            <Activity className="text-indigo-500" size={24} />
          </div>
          <div className="h-64">
            <LineChart width={300} height={220} data={vibrationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Vibration (g)" />
            </LineChart>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Risk Assessment</h2>
            <Shield className="text-green-500" size={20} />
          </div>
          <div className="h-64 flex justify-center items-center">
            <PieChart width={200} height={200}>
              <Pie
                data={riskScoreData}
                cx={100}
                cy={100}
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {riskScoreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 col-span-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Hop Analysis Details</h2>
              <div className="flex mt-2 space-x-2">
                {hopDetails.map(hop => (
                  <button
                    key={hop.hop}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${selectedHop === hop.hop ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setSelectedHop(hop.hop)}
                  >
                    Hop {hop.hop}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-600 mr-2">AI Confidence:</span>
              <span className="font-bold text-blue-600">{selectedHopData.confidence * 100}%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Detected Anomalies</h3>
              <div className="space-y-2">
                {selectedHopData.anomalies.map((anomaly, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${severityColor(anomaly.severity)}`}>
                          {anomaly.severity}
                        </span>
                        <span className="ml-2 font-medium">{anomaly.type}</span>
                      </div>
                      <span className="text-xs text-gray-500">{anomaly.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{anomaly.details}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">AI Insights</h3>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100">
                {selectedHopData.aiInsights}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">Environmental Analysis</h3>
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-md border border-green-100">
                  {selectedHopData.environmentalFactors}
                </p>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">Predictive Analysis</h3>
                <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-md border border-purple-100">
                  {selectedHopData.predictiveAnalysis}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Advanced AI Monitoring</h2>
          <Zap className="text-yellow-500" size={24} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Pattern Recognition</h3>
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Normal delivery pattern detected. Route efficiency at 94%.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">ML Confidence</h3>
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Package integrity verified with 98.6% confidence.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Time Analysis</h3>
              <Clock size={18} className="text-amber-600" />
            </div>
            <p className="text-sm text-gray-600">On-time probability: 97%. Current variance: +3 min.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Route Optimization</h3>
              <Map size={18} className="text-indigo-600" />
            </div>
            <p className="text-sm text-gray-600">Active traffic avoidance applied at hop 2. Distance saved: 0.7km.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">AI Debug Console</h2>
          <Terminal className="text-gray-400" size={24} />
        </div>
        
        <div className="bg-black rounded p-4 font-mono text-xs text-green-400 h-32 overflow-y-auto">
          <div>[2025-03-19 08:15:23] AI Module initialized - Package PRD-3452-XY</div>
          <div>[2025-03-19 08:15:24] Loading historical route patterns...</div>
          <div>[2025-03-19 08:22:12] Anomaly detection threshold set: 0.65</div>
          <div>[2025-03-19 08:35:47] Environment sensors online - monitoring temperature, humidity, light, vibration</div>
          <div>[2025-03-19 09:12:31] WARNING: Minor route deviation detected at hop 2</div>
          <div>[2025-03-19 09:12:35] Analyzing traffic patterns: Congestion detected on main route</div>
          <div>[2025-03-19 09:12:38] AI decision: Route deviation optimal, ETA impact minimal</div>
          <div>[2025-03-19 10:05:12] WARNING: Unscheduled stop detected at hop 3</div>
          <div>[2025-03-19 10:08:47] Temperature variance detected: +3.6°C above baseline</div>
          <div>[2025-03-19 10:14:22] Package integrity verification: PASS</div>
          <div>[2025-03-19 10:15:03] Movement resumed, recalculating ETA...</div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;