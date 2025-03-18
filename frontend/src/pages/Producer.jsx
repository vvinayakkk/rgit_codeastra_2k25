import React, { useState, useEffect } from 'react';
import { 
  Package, 
  BarChart2, 
  CheckCircle, 
  Clock,
  TruckIcon,
  ThermometerIcon,
  GlobeIcon
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const ProducerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({});

  // Simulate fetching products from blockchain
  useEffect(() => {
    const demoProducts = [
      { id: 'PRD-001', name: 'Organic Coffee Beans', quantity: 500, destination: 'US-NYC-WH3', status: 'Verified', compliance: 'Passed', timestamp: '2025-03-17T14:22:18' },
      { id: 'PRD-002', name: 'Tea Leaves Premium', quantity: 350, destination: 'UK-LDN-WH1', status: 'Pending', compliance: 'In Review', timestamp: '2025-03-18T09:15:42' },
      { id: 'PRD-003', name: 'Cocoa Powder', quantity: 750, destination: 'DE-BER-WH2', status: 'Verified', compliance: 'Passed', timestamp: '2025-03-17T11:05:33' },
      { id: 'PRD-004', name: 'Vanilla Extract', quantity: 200, destination: 'FR-PAR-WH4', status: 'Blocked', compliance: 'Failed', timestamp: '2025-03-16T16:48:27' },
    ];
    setProducts(demoProducts);

    // Simulate fetching transactions from blockchain
    const demoTransactions = [
      {
        transactionId: "58e72a8d-f9b1-4c5a-8373-4b7d2f9fea5d",
        productId: "PRD-3452-XY",
        receiver: "0x1a45cf8347dc0f4d9d8ace84532618b4e8d60582",
        transactionValue: 1560075,
        transactionVolume: 45,
        supplyChainNodeType: "Distributor",
        transportationMethod: "Air Freight",
        temperatureLogs: 22.4,
        timestamp: "2025-03-18T08:45:12"
      },
      {
        transactionId: "a2c43f12-d8e7-4b91-93f6-87c2e4a19d3b",
        productId: "PRD-001",
        receiver: "0x3b72fe8c25e46d5c38a2e28f221c7af2e035fd8b",
        transactionValue: 850000,
        transactionVolume: 250,
        supplyChainNodeType: "Retailer",
        transportationMethod: "Sea Freight",
        temperatureLogs: 18.1,
        timestamp: "2025-03-17T16:22:33"
      },
      {
        transactionId: "7d98c4a3-e526-47f1-b3a9-210fd839c654",
        productId: "PRD-003",
        receiver: "0x6d21cf8914dc8157a4fed9e1b968ef19c2e98425",
        transactionValue: 1200000,
        transactionVolume: 400,
        supplyChainNodeType: "Wholesaler",
        transportationMethod: "Road Transport",
        temperatureLogs: 19.7,
        timestamp: "2025-03-17T11:35:27"
      },
      {
        transactionId: "e5f9b372-a1c8-4e59-b063-8cd54fd715a9",
        productId: "PRD-002",
        receiver: "0x2a4f8c934db752c650fa4b93fe7c97e5fac38751",
        transactionValue: 525000,
        transactionVolume: 175,
        supplyChainNodeType: "Distributor",
        transportationMethod: "Air Freight",
        temperatureLogs: 20.2,
        timestamp: "2025-03-16T14:18:45"
      },
      {
        transactionId: "d3e2a17f-c6b9-48f2-a0e5-916fd4c2e83b",
        productId: "PRD-004",
        receiver: "0x8e42f6c91d37a8654bc3dd25e2a31634c715fd96",
        transactionValue: 320000,
        transactionVolume: 100,
        supplyChainNodeType: "Retailer",
        transportationMethod: "Road Transport",
        temperatureLogs: 21.8,
        timestamp: "2025-03-16T09:43:19"
      }
    ];
    setTransactions(demoTransactions);

    // Prepare chart data
    const weeklyTransactionData = [
      { day: 'Mon', transactions: 23, volume: 850, value: 1250000 },
      { day: 'Tue', transactions: 28, volume: 920, value: 1400000 },
      { day: 'Wed', transactions: 35, volume: 1100, value: 1850000 },
      { day: 'Thu', transactions: 42, volume: 1300, value: 2100000 },
      { day: 'Fri', transactions: 54, volume: 1500, value: 2450000 },
      { day: 'Sat', transactions: 35, volume: 1000, value: 1750000 },
      { day: 'Sun', transactions: 30, volume: 950, value: 1500000 }
    ];

    const nodeDistribution = [
      { name: 'Distributor', value: 42 },
      { name: 'Retailer', value: 28 },
      { name: 'Wholesaler', value: 18 },
      { name: 'Producer', value: 12 }
    ];

    const complianceHistory = [
      { month: 'Oct', passed: 85, review: 10, failed: 5 },
      { month: 'Nov', passed: 88, review: 9, failed: 3 },
      { month: 'Dec', passed: 90, review: 8, failed: 2 },
      { month: 'Jan', passed: 92, review: 6, failed: 2 },
      { month: 'Feb', passed: 94, review: 5, failed: 1 },
      { month: 'Mar', passed: 95, review: 4, failed: 1 }
    ];

    setChartData({
      weeklyTransactionData,
      nodeDistribution,
      complianceHistory
    });
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get icon for transportation method
  const getTransportIcon = (method) => {
    switch (method) {
      case 'Air Freight':
        return <GlobeIcon size={16} className="text-blue-400" />;
      case 'Sea Freight':
        return <GlobeIcon size={16} className="text-indigo-400" />;
      case 'Road Transport':
        return <TruckIcon size={16} className="text-green-400" />;
      default:
        return <TruckIcon size={16} className="text-gray-400" />;
    }
  };

  // Colors for pie chart
  const COLORS = ['#4EA8DE', '#8884d8', '#9F7AEA', '#6366F1'];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Total Products</h3>
                  <Package className="text-blue-300" size={24} />
                </div>
                <p className="text-3xl font-bold mt-2">{products.length}</p>
                <p className="text-blue-300 text-sm mt-2">+2 in the last 24 hours</p>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Verified Items</h3>
                  <CheckCircle className="text-indigo-300" size={24} />
                </div>
                <p className="text-3xl font-bold mt-2">{products.filter(p => p.status === 'Verified').length}</p>
                <p className="text-indigo-300 text-sm mt-2">98% success rate</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Pending Compliance</h3>
                  <Clock className="text-purple-300" size={24} />
                </div>
                <p className="text-3xl font-bold mt-2">{products.filter(p => p.compliance === 'In Review' || p.compliance === 'Not Started').length}</p>
                <p className="text-purple-300 text-sm mt-2">Average processing time: 2.4 hours</p>
              </div>
            </div>
            
            {/* Enhanced Blockchain Activity Visualization Section */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-medium mb-4">Blockchain Activity</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Transaction Chart */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-blue-300 font-medium mb-2">Weekly Transaction Volume</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.weeklyTransactionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="day" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '4px' }} 
                          itemStyle={{ color: '#E5E7EB' }}
                          labelStyle={{ color: '#E5E7EB' }}
                        />
                        <Legend />
                        <Bar dataKey="volume" name="Units" fill="#4EA8DE" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Supply Chain Node Distribution */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-indigo-300 font-medium mb-2">Supply Chain Distribution</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.nodeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.nodeDistribution?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '4px' }} 
                          itemStyle={{ color: '#E5E7EB' }}
                          labelStyle={{ color: '#E5E7EB' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Compliance History Chart */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-purple-300 font-medium mb-2">Compliance History</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.complianceHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="month" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '4px' }} 
                          itemStyle={{ color: '#E5E7EB' }}
                          labelStyle={{ color: '#E5E7EB' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="passed" name="Passed" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="review" name="In Review" stroke="#FBBF24" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="failed" name="Failed" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transaction History Table */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-medium mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                    <tr>
                      <th scope="col" className="px-4 py-3">Transaction ID</th>
                      <th scope="col" className="px-4 py-3">Product ID</th>
                      <th scope="col" className="px-4 py-3">Receiver</th>
                      <th scope="col" className="px-4 py-3">Value</th>
                      <th scope="col" className="px-4 py-3">Volume</th>
                      <th scope="col" className="px-4 py-3">Node Type</th>
                      <th scope="col" className="px-4 py-3">Transport</th>
                      <th scope="col" className="px-4 py-3">Temperature</th>
                      <th scope="col" className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.transactionId} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="px-4 py-3 font-medium text-blue-400">{tx.transactionId.substring(0, 8)}...</td>
                        <td className="px-4 py-3">{tx.productId}</td>
                        <td className="px-4 py-3 font-mono text-gray-400">{`${tx.receiver.substring(0, 6)}...${tx.receiver.substring(tx.receiver.length - 4)}`}</td>
                        <td className="px-4 py-3 text-green-400">{formatCurrency(tx.transactionValue)}</td>
                        <td className="px-4 py-3">{tx.transactionVolume} units</td>
                        <td className="px-4 py-3">{tx.supplyChainNodeType}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {getTransportIcon(tx.transportationMethod)}
                            <span className="ml-1">{tx.transportationMethod}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <ThermometerIcon size={16} className="text-red-400 mr-1" />
                            {tx.temperatureLogs}°C
                          </div>
                        </td>
                        <td className="px-4 py-3">{formatDate(tx.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-medium mb-4">Compliance Status</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Passed</span>
                    <span className="text-sm text-green-400">
                      {products.filter(p => p.compliance === 'Passed').length} / {products.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${(products.filter(p => p.compliance === 'Passed').length / products.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">In Review</span>
                    <span className="text-sm text-yellow-400">
                      {products.filter(p => p.compliance === 'In Review').length} / {products.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${(products.filter(p => p.compliance === 'In Review').length / products.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Failed</span>
                    <span className="text-sm text-red-400">
                      {products.filter(p => p.compliance === 'Failed').length} / {products.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${(products.filter(p => p.compliance === 'Failed').length / products.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProducerDashboard;