import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertTriangle, Box, Truck, Factory, Store, AlertCircle, ChevronDown, ChevronUp, Clock, DollarSign, ShoppingCart, Thermometer } from 'lucide-react';

const SupplyChainDashboard = () => {
  const [supplyChainData] = useState([
    {
      "transaction_id": "58e72a8d-f9b1-4c5a-8373-4b7d2f9fea5d",
      "timestamp": "2024-05-15T08:30:45",
      "sender_address": "0x7fe42b83c159267a7b51e3c2e152d3d3a5b5b0a8",
      "receiver_address": "0x1a45cf8347dc0f4d9d8ace84532618b4e8d60582",
      "product_id": "PRD-3452-XY",
      "transaction_value": 15600.75,
      "transaction_volume": 150,
      "transaction_completion_time": 0.3,
      "product_category": "Electronics",
      "manufacturer_id": "Manufacturer_12",
      "manufacturing_location": "Shanghai",
      "manufacturing_timestamp": "2024-05-15T08:00:00",
      "expected_shelf_life": 730,
      "product_certification_status": "Valid", // Changed to Valid
      "sender_historical_transaction_count": 50, // Increased to avoid threat
      "receiver_historical_transaction_count": 189,
      "geographical_distance": 5280.5,
      "time_zone_difference": 8,
      "market_price_deviation": 18.5,
      "supply_chain_node_type": "Manufacturer",
      "transportation_method": "Sea Freight",
      "temperature_logs": 22.4
    },
    {
      "transaction_id": "65f92b7e-a8c1-3d6b-4e62-5c9a3f8b7d12",
      "timestamp": "2024-05-16T10:45:30",
      "sender_address": "0x1a45cf8347dc0f4d9d8ace84532618b4e8d60582",
      "receiver_address": "0x9d82e5f0a123b4c567d89a01f2e34c56a7b8c9d0",
      "product_id": "PRD-3452-XY",
      "transaction_value": 16800.50,
      "transaction_volume": 150,
      "transaction_completion_time": 0.5,
      "product_category": "Electronics",
      "manufacturer_id": "Manufacturer_12",
      "manufacturing_location": "Shanghai",
      "manufacturing_timestamp": "2024-05-15T08:00:00",
      "expected_shelf_life": 730,
      "product_certification_status": "Valid", // Changed to Valid
      "sender_historical_transaction_count": 189,
      "receiver_historical_transaction_count": 542,
      "geographical_distance": 2150.3,
      "time_zone_difference": 3,
      "market_price_deviation": 25.2,
      "supply_chain_node_type": "Distributor",
      "transportation_method": "Air Freight",
      "temperature_logs": 24.8
    },
    {
      "transaction_id": "32a7b9c4-e6d5-4f3a-9b8c-7d6e5f4a3b2c",
      "timestamp": "2024-05-18T15:20:15",
      "sender_address": "0x9d82e5f0a123b4c567d89a01f2e34c56a7b8c9d0",
      "receiver_address": "0x3f2e1d0c9b8a7d6e5f4c3b2a1d0e9f8a7b6c5d4",
      "product_id": "PRD-3452-XY",
      "transaction_value": 18500.25,
      "transaction_volume": 150,
      "transaction_completion_time": 0.2,
      "product_category": "Electronics",
      "manufacturer_id": "Manufacturer_12",
      "manufacturing_location": "Shanghai",
      "manufacturing_timestamp": "2024-05-15T08:00:00",
      "expected_shelf_life": 730,
      "product_certification_status": "Expired", // Threat here
      "sender_historical_transaction_count": 542,
      "receiver_historical_transaction_count": 78,
      "geographical_distance": 750.8,
      "time_zone_difference": 1,
      "market_price_deviation": 38.7, // Threat here
      "supply_chain_node_type": "Wholesaler",
      "transportation_method": "Ground Transport",
      "temperature_logs": 23.1
    },
    {
      "transaction_id": "7d8e9f0a-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
      "timestamp": "2024-05-20T09:40:55",
      "sender_address": "0x3f2e1d0c9b8a7d6e5f4c3b2a1d0e9f8a7b6c5d4",
      "receiver_address": "0x5e4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6",
      "product_id": "PRD-3452-XY",
      "transaction_value": 21200.00,
      "transaction_volume": 150,
      "transaction_completion_time": 0.4,
      "product_category": "Electronics",
      "manufacturer_id": "Manufacturer_12",
      "manufacturing_location": "Shanghai",
      "manufacturing_timestamp": "2024-05-15T08:00:00",
      "expected_shelf_life": 730,
      "product_certification_status": "Valid", // Changed to Valid
      "sender_historical_transaction_count": 78,
      "receiver_historical_transaction_count": 325,
      "geographical_distance": 320.2,
      "time_zone_difference": 0,
      "market_price_deviation": 57.8, // Threat here
      "supply_chain_node_type": "Retailer",
      "transportation_method": "Ground Transport",
      "temperature_logs": 22.8
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedProduct] = useState('PRD-3452-XY');
  const [fraudAlerts, setFraudAlerts] = useState([]);

  useEffect(() => {
    const detectFraud = () => {
      const alerts = [];
      supplyChainData.forEach((transaction, index) => {
        if (transaction.product_certification_status === "Expired") {
          alerts.push({ id: `alert-cert-${index}`, transaction_id: transaction.transaction_id, severity: 'high', message: 'Expired Certification', timestamp: transaction.timestamp, node_type: transaction.supply_chain_node_type });
        }
        if (transaction.market_price_deviation > 30) {
          alerts.push({ id: `alert-price-${index}`, transaction_id: transaction.transaction_id, severity: 'medium', message: `Price Spike: ${transaction.market_price_deviation}%`, timestamp: transaction.timestamp, node_type: transaction.supply_chain_node_type });
        }
        if (transaction.sender_historical_transaction_count < 5) {
          alerts.push({ id: `alert-sender-${index}`, transaction_id: transaction.transaction_id, severity: 'medium', message: 'New Sender Risk', timestamp: transaction.timestamp, node_type: transaction.supply_chain_node_type });
        }
      });
      setFraudAlerts(alerts);
    };
    detectFraud();
    setTimeout(() => setIsLoading(false), 1000);
  }, [supplyChainData]);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const totalDistance = supplyChainData.reduce((sum, item) => sum + item.geographical_distance, 0);
  const totalTransactionTime = supplyChainData.reduce((sum, item) => sum + item.transaction_completion_time, 0);

  const priceEvolutionData = supplyChainData.map(item => ({
    name: new Date(item.timestamp).toLocaleDateString(),
    value: item.transaction_value,
    nodeType: item.supply_chain_node_type,
    isFraud: item.market_price_deviation > 30
  }));

  const getNodeColor = (nodeType, hasFraud) => {
    if (hasFraud) return 'bg-gradient-to-br from-red-700 to-red-900 shadow-red-600/50';
    switch(nodeType) {
      case 'Manufacturer': return 'bg-gradient-to-br from-blue-800 to-blue-600 shadow-blue-700/50';
      case 'Distributor': return 'bg-gradient-to-br from-indigo-800 to-indigo-600 shadow-indigo-700/50';
      case 'Wholesaler': return 'bg-gradient-to-br from-gray-800 to-gray-600 shadow-gray-700/50';
      case 'Retailer': return 'bg-gradient-to-br from-teal-800 to-teal-600 shadow-teal-700/50';
      default: return 'bg-gradient-to-br from-gray-800 to-gray-600 shadow-gray-700/50';
    }
  };

  const getNodeIcon = (nodeType) => {
    switch(nodeType) {
      case 'Manufacturer': return <Factory className="w-8 h-8 text-white" />;
      case 'Distributor': return <Truck className="w-8 h-8 text-white" />;
      case 'Wholesaler': return <Box className="w-8 h-8 text-white" />;
      case 'Retailer': return <Store className="w-8 h-8 text-white" />;
      default: return <Box className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-hidden relative">
      {/* Dark Blue Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-900/20 rounded-full blur-3xl top-0 left-0 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-800/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="relative">
            <div className="w-24 h-24 border-4 border-t-blue-600 border-b-blue-800 rounded-full animate-spin" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-blue-400">Loading Data...</p>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Product Journey Monitor
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Box, label: "Product ID", value: selectedProduct, color: "blue" },
                { icon: ShoppingCart, label: "Total Volume", value: `${supplyChainData[0]?.transaction_volume} units`, color: "indigo" },
                { icon: Clock, label: "Journey Time", value: `${totalTransactionTime.toFixed(1)} hrs`, color: "gray" },
                { icon: DollarSign, label: "Value Surge", value: `${((supplyChainData[supplyChainData.length-1]?.transaction_value / supplyChainData[0]?.transaction_value - 1) * 100).toFixed(1)}%`, color: "teal" },
              ].map((stat, idx) => (
                <motion.div key={idx} className="bg-gray-900/70 rounded-xl p-4 border border-gray-800" whileHover={{ scale: 1.05 }}>
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className={`font-bold text-${stat.color}-400 text-lg`}>{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Threat Section */}
          {fraudAlerts.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <div className="bg-gray-900/70 border-2 border-red-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                  <h2 className="text-2xl font-bold text-red-400">Journey Alerts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fraudAlerts.map(alert => (
                    <motion.div key={alert.id} className="bg-red-900/30 border border-red-700 rounded-lg p-4" whileHover={{ scale: 1.05 }}>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                        <div>
                          <p className="font-semibold text-red-300 text-lg">{alert.message}</p>
                          <p className="text-sm text-gray-400">{alert.node_type} • {formatDate(alert.timestamp)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Flow Chart */}
          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Supply Chain Flow</h2>
            <div className="bg-gray-900/70 rounded-xl p-6 border border-gray-800 overflow-x-auto">
              <div className="flex items-center justify-between min-w-max gap-8">
                {supplyChainData.map((node, index) => {
                  const hasFraud = fraudAlerts.some(alert => alert.transaction_id === node.transaction_id);
                  return (
                    <motion.div key={node.transaction_id} className="relative flex flex-col items-center" whileHover={{ scale: 1.1 }}>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getNodeColor(node.supply_chain_node_type, hasFraud)} shadow-lg`}>
                        {getNodeIcon(node.supply_chain_node_type)}
                      </div>
                      <p className="mt-3 font-semibold text-lg text-blue-300">{node.supply_chain_node_type}</p>
                      <p className="text-sm text-gray-400">{new Date(node.timestamp).toLocaleDateString()}</p>
                      {hasFraud && (
                        <motion.div className="absolute -top-2 -right-2 bg-red-700 rounded-full p-1" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      {index < supplyChainData.length - 1 && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2">
                          <div className="flex items-center">
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <ArrowRight className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div className="bg-gray-900/70 rounded-xl p-6 border border-gray-800" initial={{ x: -100 }} animate={{ x: 0 }}>
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Price Evolution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5EAA" />
                  <XAxis dataKey="name" stroke="#93C5FD" />
                  <YAxis stroke="#93C5FD" />
                  <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', borderColor: '#3B82F6', borderRadius: '8px' }} labelStyle={{ color: '#BFDBFE' }} />
                  <Line type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={3} dot={{ r: 8, fill: "#60A5FA", stroke: "#1E3A8A", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div className="bg-gray-900/70 rounded-xl p-6 border border-gray-800" initial={{ x: 100 }} animate={{ x: 0 }}>
              <h3 className="text-2xl font-semibold mb-4 text-indigo-400">Node Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplyChainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5EAA" />
                  <XAxis dataKey="supply_chain_node_type" stroke="#93C5FD" />
                  <YAxis stroke="#93C5FD" />
                  <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', borderColor: '#3B82F6', borderRadius: '8px' }} labelStyle={{ color: '#BFDBFE' }} />
                  <Legend />
                  <Bar dataKey="transaction_value" fill="#3B82F6" name="Value (÷100)" />
                  <Bar dataKey="geographical_distance" fill="#60A5FA" name="Distance (km)" />
                  <Bar dataKey="transaction_completion_time" fill="#93C5FD" name="Time (hrs)" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Transaction Cards */}
          <motion.div className="mb-8" initial={{ y: 100 }} animate={{ y: 0 }}>
            <h2 className="text-3xl font-bold mb-6 text-teal-400">Journey Logs</h2>
            <div className="space-y-6">
              {supplyChainData.map((transaction, index) => {
                const hasFraud = fraudAlerts.some(alert => alert.transaction_id === transaction.transaction_id);
                return (
                  <motion.div
                    key={transaction.transaction_id}
                    className={`bg-gray-900/70 rounded-xl overflow-hidden border ${hasFraud ? 'border-red-700 shadow-red-600/50' : 'border-gray-800'} hover:shadow-lg`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-6 cursor-pointer flex justify-between items-center" onClick={() => setExpandedCard(expandedCard === index ? null : index)}>
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getNodeColor(transaction.supply_chain_node_type, hasFraud)}`}>
                          {getNodeIcon(transaction.supply_chain_node_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl text-blue-300">{transaction.supply_chain_node_type}</h3>
                          <p className="text-sm text-gray-400">{formatDate(transaction.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {hasFraud && <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />}
                        <div className="text-right">
                          <p className="font-bold text-teal-400 text-xl">${transaction.transaction_value.toLocaleString()}</p>
                          <p className="text-sm text-indigo-300">Via {transaction.transportation_method}</p>
                        </div>
                        {expandedCard === index ? <ChevronUp className="w-6 h-6 text-blue-400" /> : <ChevronDown className="w-6 h-6 text-blue-400" />}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedCard === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="px-6 pb-6 pt-4 border-t border-gray-800"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { title: "Transaction Data", items: [
                                { label: "ID", value: transaction.transaction_id.substring(0, 8) + '...', color: "blue" },
                                { label: "Volume", value: `${transaction.transaction_volume} units`, color: "indigo" },
                                { label: "Time", value: `${transaction.transaction_completion_time} hrs`, color: "gray" },
                                { label: "Price Shift", value: `${transaction.market_price_deviation}%`, color: transaction.market_price_deviation > 30 ? "red" : "teal" },
                              ]},
                              { title: "Addresses", items: [
                                { label: "Sender", value: transaction.sender_address, color: "blue" },
                                { label: "Receiver", value: transaction.receiver_address, color: "indigo" },
                              ]},
                              { title: "Product Info", items: [
                                { label: "Category", value: transaction.product_category, color: "teal" },
                                { label: "Certification", value: transaction.product_certification_status, color: transaction.product_certification_status === "Expired" ? "red" : "blue" },
                                { label: "Temp", value: `${transaction.temperature_logs}°C`, color: "gray" },
                                { label: "Distance", value: `${transaction.geographical_distance.toFixed(1)} km`, color: "indigo" },
                              ]},
                            ].map((section, idx) => (
                              <div key={idx}>
                                <h4 className="text-lg font-semibold mb-3 text-blue-400">{section.title}</h4>
                                <ul className="space-y-3">
                                  {section.items.map((item, i) => (
                                    <li key={i} className="flex justify-between items-center">
                                      <span className="text-gray-400">{item.label}:</span>
                                      <span className={`font-mono text-${item.color}-400 ${item.label === "Sender" || item.label === "Receiver" ? "text-xs truncate max-w-[150px]" : ""}`}>
                                        {item.value}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm py-6 bg-gray-900/70 rounded-xl border border-gray-800">
            <p>Product Journey Monitor • Tracking: <span className="text-blue-400">{selectedProduct}</span> • Powered by xAI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainDashboard;
