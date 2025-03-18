import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { Calendar, AlertCircle, CheckCircle, TrendingUp, MapPin, Users } from 'lucide-react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIgdmlld0JveD0iMCAwIDI1IDI1Ij48Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTIuNSIgcj0iOC41IiBmaWxsPSIjRUY0NDQ0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
  iconSize: [25, 25],
  iconAnchor: [12.5, 12.5],
  popupAnchor: [0, -12.5],
});

// Initial sample data
const initialFraudData = [
  { month: 'Jan', producer: 25, retailer: 35, consumer: 15 },
  { month: 'Feb', producer: 30, retailer: 20, consumer: 22 },
  { month: 'Mar', producer: 15, retailer: 25, consumer: 45 },
  { month: 'Apr', producer: 40, retailer: 30, consumer: 20 },
  { month: 'May', producer: 35, retailer: 15, consumer: 30 },
  { month: 'Jun', producer: 20, retailer: 40, consumer: 25 },
];

const initialGeographicData = [
  { city: 'New York', fraudCount: 120, lat: 40.7128, lng: -74.006 },
  { city: 'Los Angeles', fraudCount: 95, lat: 34.0522, lng: -118.2437 },
  { city: 'Chicago', fraudCount: 85, lat: 41.8781, lng: -87.6298 },
  { city: 'Houston', fraudCount: 70, lat: 29.7604, lng: -95.3698 },
  { city: 'Phoenix', fraudCount: 65, lat: 33.4484, lng: -112.074 },
  { city: 'Philadelphia', fraudCount: 60, lat: 39.9526, lng: -75.1652 },
];

const initialRiskFactorData = [
  { name: 'Price', value: 35, fill: '#6366F1' },
  { name: 'Speed', value: 25, fill: '#8B5CF6' },
  { name: 'Network', value: 18, fill: '#EC4899' },
  { name: 'Cert', value: 15, fill: '#10B981' },
  { name: 'Volume', value: 7, fill: '#F59E0B' },
];

const initialUserTypeData = [
  { name: 'Producers', value: 35, fill: '#F97316' },
  { name: 'Retailers', value: 45, fill: '#3B82F6' },
  { name: 'Consumers', value: 20, fill: '#14B8A6' },
];

const initialHourlyFraudData = [
  { hour: '00:00', fraudCount: 12 },
  { hour: '04:00', fraudCount: 8 },
  { hour: '08:00', fraudCount: 15 },
  { hour: '12:00', fraudCount: 32 },
  { hour: '16:00', fraudCount: 25 },
  { hour: '20:00', fraudCount: 18 },
];

const initialScatterData = Array.from({ length: 100 }, () => ({
  risk: Math.random() * 100,
  value: Math.random() * 1000 + 500,
  type: ['Producer', 'Retailer', 'Consumer'][Math.floor(Math.random() * 3)]
}));

const initialRadarData = [
  { subject: 'Price', A: 120, B: 110, fullMark: 150 },
  { subject: 'Speed', A: 98, B: 130, fullMark: 150 },
  { subject: 'Network', A: 86, B: 130, fullMark: 150 },
  { subject: 'Cert', A: 99, B: 100, fullMark: 150 },
  { subject: 'Volume', A: 85, B: 90, fullMark: 150 },
  { subject: 'History', A: 65, B: 85, fullMark: 150 },
];

const initialMetricCards = [
  { title: 'Fraud Cases', value: '24', trend: '+12%', icon: <AlertCircle className="text-red-400" size={24} /> },
  { title: 'Compliance', value: '89%', trend: '+3%', icon: <CheckCircle className="text-green-400" size={24} /> },
  { title: 'Risk Score', value: '65', trend: '-5%', icon: <TrendingUp className="text-blue-400" size={24} /> },
  { title: 'Suspicious', value: '15', trend: '+8%', icon: <Users className="text-purple-400" size={24} /> },
];

// Function to generate random variations
const updateDataWithVariation = (data, key, variation = 0.1) => 
  data.map(item => ({
    ...item,
    [key]: Math.max(0, Math.min(150, item[key] * (1 + (Math.random() * variation * 2 - variation))))
  }));

const FraudAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fraudData, setFraudData] = useState(initialFraudData);
  const [geographicData, setGeographicData] = useState(initialGeographicData);
  const [riskFactorData, setRiskFactorData] = useState(initialRiskFactorData);
  const [userTypeData, setUserTypeData] = useState(initialUserTypeData);
  const [hourlyFraudData, setHourlyFraudData] = useState(initialHourlyFraudData);
  const [scatterData, setScatterData] = useState(initialScatterData);
  const [radarData, setRadarData] = useState(initialRadarData);
  const [metricCards, setMetricCards] = useState(initialMetricCards);

  // Update data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFraudData(prev => prev.map(item => ({
        ...item,
        producer: Math.max(0, item.producer + (Math.random() * 10 - 5)),
        retailer: Math.max(0, item.retailer + (Math.random() * 10 - 5)),
        consumer: Math.max(0, item.consumer + (Math.random() * 10 - 5)),
      })));
      
      setGeographicData(prev => updateDataWithVariation(prev, 'fraudCount'));
      setRiskFactorData(prev => updateDataWithVariation(prev, 'value'));
      setUserTypeData(prev => updateDataWithVariation(prev, 'value'));
      setHourlyFraudData(prev => updateDataWithVariation(prev, 'fraudCount'));
      
      setScatterData(prev => prev.map(item => ({
        ...item,
        risk: Math.random() * 100,
        value: Math.random() * 1000 + 500,
      })));
      
      setRadarData(prev => prev.map(item => ({
        ...item,
        A: Math.min(150, Math.max(50, item.A + (Math.random() * 20 - 10))),
        B: Math.min(150, Math.max(50, item.B + (Math.random() * 20 - 10))),
      })));
      
      setMetricCards(prev => prev.map(item => ({
        ...item,
        value: item.title === 'Compliance' 
          ? `${Math.min(100, Math.max(0, parseFloat(item.value) + (Math.random() * 5 - 2))).toFixed(3)}%`
          : Math.max(0, parseInt(item.value) + Math.floor(Math.random() * 5 - 2)).toString(),
        trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 10)}%`,
      })));
    }, 10000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const Card = ({ title, children, className = "" }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-200 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="relative" style={{ perspective: '1000px' }}>
        <div className="transform rotate-x-6 rotate-y-6">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-800 rounded-lg shadow overflow-hidden">
            {['overview', 'patterns', 'geographic', 'user'].map(tab => (
              <button 
                key={tab}
                className={`px-6 py-3 font-medium ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metricCards.map((card, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between transform hover:-translate-y-1 transition-all">
                <div>
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold text-white">{card.value}</span>
                    <span className={`ml-2 text-xs ${card.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {card.trend}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-gray-700">{card.icon}</div>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card title="Fraud Trends" className="h-80">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={fraudData}>
                      <CartesianGrid stroke="#4B5563" />
                      <XAxis dataKey="month" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Area type="monotone" dataKey="producer" stroke="#F97316" fill="#F97316" fillOpacity={0.7} />
                      <Area type="monotone" dataKey="retailer" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.7} />
                      <Area type="monotone" dataKey="consumer" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.7} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <Card title="User Distribution" className="h-80">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card title="Risk Factor Analysis" className="h-80">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={riskFactorData}>
                      <CartesianGrid stroke="#4B5563" />
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Bar dataKey="value">
                        {riskFactorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <Card title="Hourly Patterns" className="h-80">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={hourlyFraudData}>
                    <CartesianGrid stroke="#4B5563" />
                    <XAxis dataKey="hour" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    <Area type="monotone" dataKey="fraudCount" stroke="#6366F1" fill="#6366F1" fillOpacity={0.7} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === 'geographic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Fraud Hotspots" className="h-[500px]">
                <div className="h-[400px] relative">
                  <MapContainer
                    center={[39.8283, -98.5795]}
                    zoom={4}
                    style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {geographicData.map((city, index) => (
                      <Marker
                        key={index}
                        position={[city.lat, city.lng]}
                        icon={customIcon}
                      >
                        <Popup>
                          <div className="text-gray-900">
                            <h3 className="font-bold">{city.city}</h3>
                            <p>Fraud Cases: {city.fraudCount}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </Card>
              <Card title="Regional Risk" className="h-80">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={geographicData}>
                    <CartesianGrid stroke="#4B5563" />
                    <XAxis dataKey="city" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    <Bar dataKey="fraudCount" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card title="Risk vs Value" className="h-80">
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart>
                      <CartesianGrid stroke="#4B5563" />
                      <XAxis type="number" dataKey="risk" name="Risk" unit="%" stroke="#fff" />
                      <YAxis type="number" dataKey="value" name="Value" unit="$" stroke="#fff" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Scatter 
                        name="Transactions" 
                        data={scatterData}
                        shape={(props) => {
                          const { cx, cy } = props;
                          const type = props.payload.type;
                          return type === 'Producer' ? (
                            <circle cx={cx} cy={cy} r={5} fill="#F97316" />
                          ) : type === 'Retailer' ? (
                            <rect x={cx - 4} y={cy - 4} width={8} height={8} fill="#3B82F6" />
                          ) : (
                            <polygon points={`${cx},${cy-4} ${cx+4},${cy+2} ${cx-4},${cy+2}`} fill="#14B8A6" />
                          );
                        }}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <Card title="Fraud Fingerprint" className="h-80">
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
                    <PolarGrid stroke="#4B5563" />
                    <PolarAngleAxis dataKey="subject" stroke="#fff" />
                    <PolarRadiusAxis stroke="#fff" />
                    <Radar name="Current" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
                    <Radar name="Previous" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FraudAnalyticsDashboard;