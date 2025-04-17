import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertTriangle, Box, Truck, Factory, Store, AlertCircle, ChevronDown, ChevronUp, Clock, DollarSign, ShoppingCart, Thermometer, Send, MessageSquare, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini AI

const SupplyChainDashboard = () => {
  const [supplyChainData, setSupplyChainData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedProduct] = useState('PRD-3452-XY');
  const [fraudAlerts, setFraudAlerts] = useState([]);
  
  // Chatbot states
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hello! Welcome to the Product Journey page. I'm here to help you explore the supply chain data. What would you like to know?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  
  const chatContainerRef = useRef(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI('AIzaSyA-dVx1ZbV4s2U7Ih0M4j1AoRv1QA25GrA'); // Replace with your Gemini API key

  const fetchData = () => {
    import('../data.json').then(data => {
      const randomIndex = Math.floor(Math.random() * data.default.length);
      const randomTransaction = data.default[randomIndex];
      const relatedTransactions = data.default
        .filter(transaction => 
          transaction.product_category === randomTransaction.product_category &&
          transaction.transaction_id !== randomTransaction.transaction_id
        )
        .slice(0, 3);
      const combinedData = [randomTransaction, ...relatedTransactions]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setSupplyChainData(combinedData);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  // Typewriter effect
  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && lastMessage.sender === 'bot' && currentMessageIndex === chatMessages.length - 1) {
      setIsTyping(true);
      setDisplayedText('');
      
      let i = 0;
      const speed = 5; // Increased typing speed (reduced from 20 to 5ms)
      const text = lastMessage.text;
      
      const typeWriter = () => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
          setTimeout(typeWriter, speed);
        } else {
          setIsTyping(false);
          setIsInputDisabled(false);
        }
      };
      
      typeWriter();
    }
  }, [chatMessages, currentMessageIndex]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [displayedText]);

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

  // Real Gemini API call
  const getBotResponse = async (input) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `You are a supply chain assistant. The user asked: "${input}". Provide a detailed response in Markdown format. This is the product journey page input given to the supply chain throughout the website. You need to reply in a detailed and great manner in the form of tables and charts as if the user is new to the website. Always try to include tables and respond in a friendly tone.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isInputDisabled) return;

    setIsInputDisabled(true);
    
    // Add user message to chat
    const newMessages = [...chatMessages, { sender: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    
    // Set typing indicator
    setIsTyping(true);
    
    // Get bot response from Gemini API
    try {
      const botResponse = await getBotResponse(userInput);
      const updatedMessages = [...newMessages, { sender: 'bot', text: botResponse }];
      setChatMessages(updatedMessages);
      setCurrentMessageIndex(updatedMessages.length - 1);
    } catch (error) {
      console.error("Error getting bot response:", error);
      const updatedMessages = [...newMessages, { sender: 'bot', text: "I'm sorry, I couldn't process your request. Please try again." }];
      setChatMessages(updatedMessages);
      setCurrentMessageIndex(updatedMessages.length - 1);
      setIsInputDisabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-900/20 rounded-full blur-3xl top-0 left-0 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-800/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <div className="w-24 h-24 border-4 border-t-blue-600 border-b-blue-800 rounded-full animate-spin" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-blue-400">Loading Data...</p>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col min-h-screen">
          {/* Dashboard Content */}
          <div className="flex-1">
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
                  <LineChart data={priceEvolutionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5EAA" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#93C5FD"
                      tick={{ fill: '#93C5FD' }}
                      tickLine={{ stroke: '#93C5FD' }}
                    />
                    <YAxis 
                      stroke="#93C5FD"
                      tick={{ fill: '#93C5FD' }}
                      tickLine={{ stroke: '#93C5FD' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E3A8A', 
                        borderColor: '#3B82F6', 
                        borderRadius: '8px',
                        padding: '10px'
                      }} 
                      itemStyle={{ color: '#BFDBFE' }}
                      labelStyle={{ color: '#BFDBFE', marginBottom: '5px' }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#93C5FD' }}
                      iconType="circle"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#60A5FA" 
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#60A5FA", stroke: "#1E3A8A", strokeWidth: 2 }}
                      activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
              <motion.div className="bg-gray-900/70 rounded-xl p-6 border border-gray-800" initial={{ x: 100 }} animate={{ x: 0 }}>
                <h3 className="text-2xl font-semibold mb-4 text-indigo-400">Node Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={supplyChainData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5EAA" />
                    <XAxis 
                      dataKey="supply_chain_node_type" 
                      stroke="#93C5FD"
                      tick={{ fill: '#93C5FD' }}
                      tickLine={{ stroke: '#93C5FD' }}
                      interval={0}
                    />
                    <YAxis 
                      stroke="#93C5FD"
                      tick={{ fill: '#93C5FD' }}
                      tickLine={{ stroke: '#93C5FD' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E3A8A', 
                        borderColor: '#3B82F6', 
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                      itemStyle={{ color: '#BFDBFE' }}
                      labelStyle={{ color: '#BFDBFE', marginBottom: '5px' }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#93C5FD' }}
                      iconType="circle"
                    />
                    <Bar 
                      dataKey="transaction_value" 
                      fill="#3B82F6" 
                      name="Value (÷100)"
                      animationDuration={1000}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="geographical_distance" 
                      fill="#60A5FA" 
                      name="Distance (km)"
                      animationDuration={1200}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="transaction_completion_time" 
                      fill="#93C5FD" 
                      name="Time (hrs)"
                      animationDuration={1400}
                      radius={[4, 4, 0, 0]}
                    />
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
            <div className="text-center text-gray-500 text-sm py-6 bg-gray-900/70 rounded-xl border border-gray-800 mb-8">
              <p>Product Journey Monitor • Tracking: <span className="text-blue-400">{selectedProduct}</span> • Powered by xAI</p>
            </div>
          </div>

          {/* Improved Chatbot Section */}
          <motion.div 
            className="bg-gray-900/70 rounded-xl border border-gray-800 mt-auto overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-blue-400 mr-2" />
                <h2 className="text-xl font-bold text-blue-400">Supply Chain Assistant</h2>
              </div>
              <div className="flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-green-400">Online</span>
              </div>
            </div>
            
            <div 
              className="max-h-96 overflow-y-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800/80 space-y-6"
              ref={chatContainerRef}
            >
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-3/4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${msg.sender === 'user' ? 'bg-blue-600 ml-3' : 'bg-gray-700 mr-3'}`}>
                      {msg.sender === 'user' ? 
                        <User className="w-5 h-5 text-white" /> : 
                        <Bot className="w-5 h-5 text-blue-300" />
                      }
                    </div>
                    <div className={`rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'}`}>
                      {msg.sender === 'user' ? (
                        <p className="text-sm">{msg.text}</p>
                      ) : (
                        <div className="prose prose-invert text-sm max-w-none">
                          {idx === currentMessageIndex && isTyping ? (
                            <>
                              <ReactMarkdown
                                components={{
                                  table: props => (
                                    <div className="overflow-x-auto">
                                      <table className="border-collapse w-full my-2" {...props} />
                                    </div>
                                  ),
                                  th: props => (
                                    <th className="border border-gray-700 p-2 bg-gray-800 text-blue-400" {...props} />
                                  ),
                                  td: props => (
                                    <td className="border border-gray-700 p-2" {...props} />
                                  ),
                                }}
                              >
                                {displayedText}
                              </ReactMarkdown>
                              <span className="inline-block w-2 h-5 bg-blue-400 ml-1 animate-pulse"/>
                            </>
                          ) : (
                            <ReactMarkdown
                              components={{
                                table: props => (
                                  <div className="overflow-x-auto">
                                    <table className="border-collapse w-full my-2" {...props} />
                                  </div>
                                ),
                                th: props => (
                                  <th className="border border-gray-700 p-2 bg-gray-800 text-blue-400" {...props} />
                                ),
                                td: props => (
                                  <td className="border border-gray-700 p-2" {...props} />
                                ),
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && currentMessageIndex === chatMessages.length && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 mr-3">
                      <Bot className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none p-4 bg-gray-800 text-gray-200 border border-gray-700">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-700 p-4 bg-gray-900/70">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ask about supply chain data..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isInputDisabled}
                />
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 ${isInputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSendMessage}
                  disabled={isInputDisabled}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {isInputDisabled && (
                <div className="mt-2 text-center text-xs text-blue-400">
                  <Clock className="inline w-3 h-3 mr-1" />
                  Assistant is responding...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainDashboard;