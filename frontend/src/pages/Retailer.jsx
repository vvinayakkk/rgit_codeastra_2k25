import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Package,
  Search,
  Filter,
  Calendar,
  AlertOctagon,
  RefreshCw,
  Thermometer,
  Clock,
  Activity,
  Pill,
  Database,
  FileText,
  Shield,
  DollarSign,
  Truck,
  Hexagon,
  Eye,
  Box,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Settings,
  BarChart2,
  Home,
  ShieldHalf
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RetailerDashboard = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ producer: '', certification: '', expired: false });
  const [showNotifications, setShowNotifications] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [chartData, setChartData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Mock pharmaceutical products from producers
  const mockProducts = [
    { 
      id: "MED-001",
      name: "Amoxicillin 500mg",
      batchNumber: "AMX-2025-032",
      producer: "MediPharm Ltd.",
      manufacturingDate: "2025-01-15",
      expiryDate: "2027-01-14",
      price: 4850,
      quantity: 5000,
      packSize: "10x10 tablets",
      temperature: "20-25°C",
      certifications: ["GMP", "WHO-GMP", "ISO 9001"],
      verified: true
    },
    { 
      id: "MED-002",
      name: "Azithromycin 250mg",
      batchNumber: "AZT-2025-087",
      producer: "BioGeneric Pharma",
      manufacturingDate: "2025-02-03",
      expiryDate: "2027-02-02",
      price: 5200,
      quantity: 3000,
      packSize: "6x10 tablets",
      temperature: "15-30°C",
      certifications: ["GMP", "ISO 9001"],
      verified: true
    },
    { 
      id: "MED-003",
      name: "Montelukast 10mg",
      batchNumber: "MTL-2025-109",
      producer: "LifeScience Pharmaceuticals",
      manufacturingDate: "2025-02-18",
      expiryDate: "2026-08-17",
      price: 6430,
      quantity: 2000,
      packSize: "3x10 tablets",
      temperature: "20-25°C",
      certifications: ["GMP", "ISO 13485"],
      verified: true
    },
    { 
      id: "MED-004",
      name: "Paracetamol 650mg",
      batchNumber: "PCM-2025-214",
      producer: "MediPharm Ltd.",
      manufacturingDate: "2025-03-05",
      expiryDate: "2028-03-04",
      price: 1250,
      quantity: 10000,
      packSize: "15x10 tablets",
      temperature: "20-25°C",
      certifications: ["GMP", "WHO-GMP"],
      verified: true
    },
    { 
      id: "MED-005",
      name: "Insulin Glargine 100IU",
      batchNumber: "INS-2025-063",
      producer: "DiabeCare Biologics",
      manufacturingDate: "2025-01-25",
      expiryDate: "2026-01-24",
      price: 12800,
      quantity: 500,
      packSize: "5 vials",
      temperature: "2-8°C",
      certifications: ["GMP", "ISO 9001", "ISO 13485"],
      verified: true
    }
  ];

  // Mock transaction history
  const mockTransactions = [
    { 
      id: "TXN-2025-001",
      productId: "MED-001",
      productName: "Amoxicillin 500mg",
      batchNumber: "AMX-2025-032",
      quantity: 1000,
      totalAmount: 970000,
      timestamp: "2025-03-10T09:23:18",
      status: "completed",
      blockchainHash: "0x7f9e8d7c6b5a4c3d2e1f0a9b8c7d6e5f4a3b2c1d",
      fraudDetected: false
    },
    { 
      id: "TXN-2025-002",
      productId: "MED-003",
      productName: "Montelukast 10mg",
      batchNumber: "MTL-2025-109",
      quantity: 500,
      totalAmount: 1607500,
      timestamp: "2025-03-12T14:05:42",
      status: "completed",
      blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s",
      fraudDetected: false
    },
    { 
      id: "TXN-2025-003",
      productId: "MED-005",
      productName: "Insulin Glargine 100IU",
      batchNumber: "INS-2025-063",
      quantity: 100,
      totalAmount: 1280000,
      timestamp: "2025-03-14T11:37:09",
      status: "completed",
      blockchainHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
      fraudDetected: false
    },
    { 
      id: "TXN-2025-004",
      productId: "MED-002",
      productName: "Azithromycin 250mg",
      batchNumber: "AZT-2025-087",
      quantity: 800,
      totalAmount: 4160000,
      timestamp: "2025-03-15T16:22:31",
      status: "flagged",
      blockchainHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v",
      fraudDetected: true,
      fraudReason: "Suspicious transaction pattern detected"
    },
    { 
      id: "TXN-2025-005",
      productId: "MED-004",
      productName: "Paracetamol 650mg",
      batchNumber: "PCM-2025-214",
      quantity: 2000,
      totalAmount: 2500000,
      timestamp: "2025-03-17T10:12:45",
      status: "completed",
      blockchainHash: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w",
      fraudDetected: false
    }
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: "NOTIF-001",
      type: "fraud",
      message: "Potential fraud detected in transaction TXN-2025-004",
      timestamp: "2025-03-15T16:23:05",
      read: false
    },
    {
      id: "NOTIF-002",
      type: "inventory",
      message: "Low stock alert: Insulin Glargine 100IU (100 units remaining)",
      timestamp: "2025-03-14T11:40:22",
      read: false
    },
    {
      id: "NOTIF-003",
      type: "price",
      message: "Price change alert: Amoxicillin 500mg decreased by 5%",
      timestamp: "2025-03-13T09:15:37",
      read: true
    },
    {
      id: "NOTIF-004",
      type: "system",
      message: "System maintenance scheduled for 2025-03-20",
      timestamp: "2025-03-12T14:30:00",
      read: true
    },
    {
      id: "NOTIF-005",
      type: "blockchain",
      message: "New producer verified: NeuroTech Pharmaceuticals",
      timestamp: "2025-03-11T15:45:12",
      read: true
    }
  ];

  // Mock fraud alerts
  const mockFraudAlerts = [
    {
      id: "FRAUD-001",
      transactionId: "TXN-2025-004",
      severity: "high",
      details: "Multiple unusual quantities purchased in short timeframe",
      timestamp: "2025-03-15T16:22:45",
      resolved: false
    }
  ];

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/transports');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setTransactions(result.data);
        console.log('Transactions loaded:', result.data); // Debug log
      } else {
        console.error('Invalid data format:', result);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProducts(), fetchTransactions()]);
        setNotifications(mockNotifications);
        setFraudAlerts(mockFraudAlerts);
        initializeChartData();
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Initialize chart data
  const initializeChartData = () => {
    setChartData({
      transactionVolume: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Transaction Volume',
            data: [3200000, 4100000, 5200000, 4800000, 6100000, 5500000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.5)'
          }
        ]
      },
      fraudMetrics: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Fraud Attempts',
            data: [3, 5, 2, 4, 1, 2],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.5)'
          }
        ]
      }
    });
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.producer ? product.producer === filters.producer : true) &&
      (filters.certification ? product.certifications.includes(filters.certification) : true) &&
      (filters.expired ? new Date(product.expiryDate) < new Date() : true)
    );
  });

  // Buy product function
  const buyProduct = (product) => {
    const quantity = prompt(`Enter quantity to purchase (Available: ${product.quantity}):`, "100");
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0 || parseInt(quantity) > product.quantity) {
      alert("Please enter a valid quantity!");
      return;
    }

    const qtyNum = parseInt(quantity);
    const totalAmount = qtyNum * product.price;
    
    // Generate transaction ID
    const txnId = `TXN-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Simulate blockchain hash
    const blockchainHash = `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    // Run "AI fraud detection" - simulate by flagging certain patterns
    const isFraudulent = Math.random() < 0.15 || 
                         (qtyNum > product.quantity * 0.5) || 
                         (product.name.includes("insulin") && qtyNum > 100);
    
    const newTransaction = {
      id: txnId,
      productId: product.id,
      productName: product.name,
      batchNumber: product.batchNumber,
      quantity: qtyNum,
      totalAmount: totalAmount,
      timestamp: new Date().toISOString(),
      status: isFraudulent ? "flagged" : "completed",
      blockchainHash: blockchainHash,
      fraudDetected: isFraudulent,
      fraudReason: isFraudulent ? "Suspicious transaction pattern detected" : null
    };
    
    // Add transaction
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    // Update product quantity
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id ? {...p, quantity: p.quantity - qtyNum} : p
      )
    );
    
    // Add fraud alert if fraud detected
    if (isFraudulent) {
      const newFraudAlert = {
        id: `FRAUD-${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: txnId,
        severity: "high",
        details: "Unusual purchase pattern detected by AI system",
        timestamp: new Date().toISOString(),
        resolved: false
      };
      
      setFraudAlerts(prev => [newFraudAlert, ...prev]);
      
      // Add notification
      const newNotification = {
        id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "fraud",
        message: `Potential fraud detected in transaction ${txnId}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show alert
      alert("⚠ FRAUD ALERT: This transaction has been flagged as potentially fraudulent and requires review!");
    } else {
      // Success notification
      const newNotification = {
        id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "transaction",
        message: `Transaction ${txnId} completed successfully`,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      alert(`Transaction completed successfully. Transaction ID: ${txnId}`);
    }
  };

  // Format currency - update to handle undefined/null values
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date - update to handle invalid dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render transaction status badge
  const renderStatusBadge = (status, fraudDetected) => {
    if (fraudDetected) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertOctagon className="w-3 h-3 mr-1" />
          Fraudulent
        </span>
      );
    }
    
    switch(status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Render notification icon based on type
  const renderNotificationIcon = (type) => {
    switch(type) {
      case 'fraud':
        return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'inventory':
        return <Package className="w-5 h-5 text-yellow-500" />;
      case 'price':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'transaction':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      case 'blockchain':
        return <Database className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Dashboard component - update total inventory calculation
  const Dashboard = () => {
    // Calculate total inventory value safely
    const totalInventoryValue = products.reduce((sum, p) => {
      const price = Number(p.price) || 0;
      const quantity = Number(p.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Row */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase">Total Inventory Value</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(totalInventoryValue)}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase">Transactions (30d)</p>
              <p className="text-3xl font-bold mt-1">{transactions.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+8.2% from last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase">Fraud Alerts</p>
              <p className="text-3xl font-bold mt-1">{fraudAlerts.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm flex items-center">
            <AlertOctagon className="w-4 h-4 mr-1" />
            <span>{fraudAlerts.filter(a => !a.resolved).length} unresolved alerts</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transactions-ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TransactionValue</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TransactionVolume</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SupplyChainNodeType</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TransportationMethod</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(0, 5).map((transaction, index) => (
                  <tr key={transaction._id || transaction.id || index} className={transaction.fraudDetected ? "bg-red-50 dark:bg-red-900 dark:bg-opacity-20" : ""}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{transaction.transactionId}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.transactionValue}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(transaction.transactionVolume)}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{transaction.supplyChainNodeType}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      {transaction.transportationMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Latest Notifications
          </h2>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification, index) => (
              <div key={notification.id || `notif-${index}`} className={`p-3 rounded-lg border ${notification.read ? 'border-gray-200 dark:border-gray-700' : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {renderNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(notification.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Product Listing component
  const ProductListing = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Pill className="w-5 h-5 mr-2 text-blue-600" />
            Available Pharmaceutical Products
          </h2>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none dark:bg-gray-700 dark:text-white"
                value={filters.producer}
                onChange={(e) => setFilters({...filters, producer: e.target.value})}
              >
                <option value="">All Producers</option>
                {[...new Set(products.map(p => p.producer))].map(producer => (
                  <option key={producer} value={producer}>{producer}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product-Id</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Certificate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {(products || []).map((product, index) => (
              <tr key={product.id || `prod-${index}`}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Pill className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{product.productId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{product.manufacturingLocation}</div>
                  <div className="flex items-center mt-1">
                    {(product.certifications || []).map((cert, certIndex) => (
                      <span key={`${product.id}-cert-${certIndex}`} className="mr-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {cert}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.manufacturingTimestamp}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(product.expectedShelfLife)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.certificationStatus}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => buyProduct(product)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {filteredProducts.length === 0 && (
      <div className="p-8 text-center">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
      </div>
    )}
  </div>
);

// Transactions History component
const TransactionHistory = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold flex items-center">
        <Database className="w-5 h-5 mr-2 text-blue-600" />
        Blockchain Transaction History
      </h2>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">To Address</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Node Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Volume</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transport</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {transaction.transactionId}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {transaction.toAddress}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {transaction.supplyChainNodeType}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {formatCurrency(transaction.transactionValue)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {transaction.transactionVolume}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1 text-blue-500" />
                  {transaction.transportationMethod}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {transactions.length === 0 && (
      <div className="p-8 text-center">
        <Database className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your transaction history will appear here.</p>
      </div>
    )}
  </div>
);

// Fraud Detection component
const FraudDetection = () => {
  const [formData, setFormData] = useState({
    transaction_id: '',
    timestamp: '',
    sender_address: '',
    receiver_address: '',
    product_id: '',
    transaction_value: '',
    transaction_volume: '',
    payment_method: '',
    transaction_completion_time: '',
    product_category: '',
    manufacturer_id: '',
    manufacturing_location: '',
    manufacturing_timestamp: '',
    expected_shelf_life: '',
    product_certification_status: '',
    sender_historical_transaction_count: '',
    receiver_historical_transaction_count: '',
    network_connection_strength: '',
    geographical_distance: '',
    time_zone_difference: '',
    market_price_deviation: '',
    seasonality_factor: '',
    supply_chain_node_type: '',
    transportation_method: '',
    temperature_logs: '',
    image: null
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fixedData = {
      transaction_id: "58e72a8d-f9b1-4c5a-8373-4b7d2f9fea5d",
      timestamp: "2024-05-15T08:30:45",
      sender_address: "0x7fe42b83c159267a7b51e3c2e152d3d3a5b5b0a8",
      receiver_address: "0x1a45cf8347dc0f4d9d8ace84532618b4e8d60582",
      product_id: "PRD-3452-XY",
      transaction_value: 15600.75,
      transaction_volume: 45,
      payment_method: "Bank Transfer",
      transaction_completion_time: 12.5,
      product_category: "Electronics",
      manufacturer_id: "Manufacturer_12",
      manufacturing_location: "China",
      manufacturing_timestamp: "2024-01-10T14:20:30",
      expected_shelf_life: 730,
      product_certification_status: "Certified",
      sender_historical_transaction_count: 245,
      receiver_historical_transaction_count: 189,
      network_connection_strength: 0.45,
      geographical_distance: 5280.5,
      time_zone_difference: 8,
      market_price_deviation: 2.1,
      seasonality_factor: 1.05,
      supply_chain_node_type: "Distributor",
      transportation_method: "Air Freight",
      temperature_logs: 22.4
    };

    try {
      const response = await axios.post('https://likely-suitable-mako.ngrok-free.app/predict', fixedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponse(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          AI Fraud Detection System
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</label>
            <input
              type="text"
              name="transaction_id"
              value={formData.transaction_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</label>
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sender Address</label>
            <input
              type="text"
              name="sender_address"
              value={formData.sender_address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Receiver Address</label>
            <input
              type="text"
              name="receiver_address"
              value={formData.receiver_address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product ID</label>
            <input
              type="text"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
        {response && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Response</h3>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Prediction:</strong> {response.prediction}</p>
              <p><strong>Probability:</strong> {response.probability}</p>
              <p><strong>Risk Level:</strong> {response.risk_level}</p>
              <p><strong>Risk Score:</strong> {response.risk_score}</p>
              <p><strong>Timestamp:</strong> {new Date(response.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <AlertOctagon className="w-5 h-5 mr-2 text-red-600" />
            Fraud Alerts
          </h2>
        </div>
        
        <div>
          {fraudAlerts.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {fraudAlerts.map((alert) => (
                <div key={alert.id} className="p-6 bg-red-50 dark:bg-red-900 dark:bg-opacity-20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        High Severity Fraud Alert: Transaction {alert.transactionId}
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                        <p>{alert.details}</p>
                      </div>
                      <div className="mt-3">
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Investigate
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No fraud alerts</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All transactions are currently verified and secure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
return (
  <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
    {/* Sidebar */}
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-950 text-white transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4 border-b border-blue-900">
        <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center w-full'}`}>
          <Shield className="h-8 w-8 text-white" />
          {sidebarOpen && <span className="ml-2 text-xl font-bold">MedTrack</span>}
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`text-white ${sidebarOpen ? '' : 'hidden'}`}>
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-5">
        <div className="px-2 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${activeTab === 'dashboard' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'} 
              group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
          >
            <Home className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-6 w-6`} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`${activeTab === 'products' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'} 
              group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
          >
            <Pill className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-6 w-6`} />
            {sidebarOpen && <span>Products</span>}
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`${activeTab === 'transactions' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'} 
              group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
          >
            <Database className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-6 w-6`} />
            {sidebarOpen && <span>Transactions</span>}
          </button>
          <button
            onClick={() => setActiveTab('fraud')}
            className={`${activeTab === 'fraud' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'} 
              group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
          >
            <AlertTriangle className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-6 w-6`} />
            {sidebarOpen && <span>Fraud Detection</span>}
          </button>
        </div>
      </nav>
    </div>

    {/* Main content */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeTab === 'dashboard' && 'Retailer Dashboard'}
              {activeTab === 'products' && 'Product Listings'}
              {activeTab === 'transactions' && 'Transaction History'}
              {activeTab === 'fraud' && 'Fraud Detection System'}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" onClick={navigate('/overall-fraud')}>
                <ShieldHalf className='w-4 h-4' />
                Over-All Fraud Deteaction 
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Bell className="h-6 w-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <div className="mt-2 space-y-2">
                      {notifications.slice(0, 5).map((notification, index) => (
                        <div key={notification.id || `notif-${index}`} className={`p-2 rounded-md ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'}`}>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {renderNotificationIcon(notification.type)}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{notification.message}</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(notification.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Retailer Account</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Loading blockchain data...</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'products' && <ProductListing />}
            {activeTab === 'transactions' && <TransactionHistory />}
            {activeTab === 'fraud' && <FraudDetection />}
          </>
        )}
      </main>
    </div>
  </div>
);
};

export default RetailerDashboard;


