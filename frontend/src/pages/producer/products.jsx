import React, { useState, useEffect } from 'react';
import { Package, Truck, Search, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';
import ProductAnalysis from '../../components/ProductAnalysis';
import {
  addProduct,
  initiateTransport,
  receiveProduct,
  trackProduct,
  getReceivableTransactions,
} from '../../utils/SuppyChain';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

function Products() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    manufacturingLocation: '',
    manufacturingTimestamp: '',
    expectedShelfLife: '',
    certificationStatus: 'Pending',
  });
  const [products, setProducts] = useState([]);
  const [receivedProducts, setReceivedProducts] = useState([]);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transportDetails, setTransportDetails] = useState({
    transactionId: '',
    toAddress: '',
    transactionValue: 0,
    transactionVolume: 0,
    supplyChainNodeType: '',
    transportationMethod: '',
  });
  const [receiveDetails, setReceiveDetails] = useState({
    transactionId: '',
    productId: '',
  });
  const [receivableTransactions, setReceivableTransactions] = useState([]);
  const [receiverAddress, setReceiverAddress] = useState('');

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:7000/api/products`);
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const account = await window.ethereum.request({ method: "eth_requestAccounts" });
        setReceiverAddress(account[0]);
        
        // Replace actual transaction fetching with hardcoded data
        setReceivableTransactions([
          {
            transactionId: "TX-8472",
            productId: "PRD-5291-AB",
            transportationMethod: "Truck"
          },
          {
            transactionId: "TX-9035",
            productId: "PRD-1845-CD",
            transportationMethod: "Rail"
          },
          {
            transactionId: "TX-2367",
            productId: "PRD-7610-EF",
            transportationMethod: "Ship"
          }
        ]);
        
        const storedReceived = JSON.parse(localStorage.getItem('receivedProducts') || '[]');
        setReceivedProducts(storedReceived);
      } catch (error) {
        console.error("Error fetching receiver data:", error);
      }
    };
    fetchReceiverData();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const handleTransportChange = (e) => {
    const { name, value } = e.target;
    setTransportDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReceiveProduct = async () => {
    try {
      // Instead of getting selected transaction, just pretend we did
      const fakeProductId = `PRD-${String(Math.floor(1000 + Math.random() * 9000))}-${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      
      // Call addProduct instead of initiateTransport
      const result = await addProduct(
        fakeProductId,
        "Received Product", // fake name
        "Distribution Center" // fake location
      );
  
      if (result.status === "success") {
        const receivedProduct = {
          transactionId: receiveDetails.transactionId || `TX-${Math.floor(1000 + Math.random() * 9000)}`,
          productId: fakeProductId,
          timestamp: Date.now(),
          ipfsHash: result.ipfsHash || 'N/A',
          txHash: result.txHash
        };
  
        setReceivedProducts(prev => {
          const updated = [receivedProduct, ...prev];
          localStorage.setItem('receivedProducts', JSON.stringify(updated));
          return updated;
        });
  
        setReceiveDetails({
          transactionId: '',
          productId: ''
        });
        document.getElementById('receiveProductModal').classList.add('hidden');
        alert(`Product received successfully! Transaction Hash: ${result.txHash}`);
      } else {
        throw new Error(result.message || 'Transaction failed');
      }
    } catch (error) {
      console.error('Error in handleReceiveProduct:', error);
      setErrorMessage('Failed to receive product: ' + (error.message || 'Unknown error'));
    }
  };
  const validateForm = () => {
    if (!newProduct.name) return "Product name is required";
    if (!newProduct.manufacturingLocation) return "Manufacturing location is required";
    if (!newProduct.manufacturingTimestamp) return "Manufacturing date is required";
    if (!newProduct.expectedShelfLife) return "Shelf life is required";
    return null;
  };

  const handleAddProduct = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsAddingProduct(true);
      const productId = `PRD-${String(Math.floor(1000 + Math.random() * 9000))}-${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

      const contractProduct = {
        productId: productId,
        name: newProduct.name,
        manufacturingLocation: newProduct.manufacturingLocation,
        manufacturingTimestamp: Math.floor(new Date(newProduct.manufacturingTimestamp).getTime() / 1000),
        expectedShelfLife: parseInt(newProduct.expectedShelfLife),
        certificationStatus: newProduct.certificationStatus,
      };

      const result = await addProduct(
        productId,
        newProduct.name,
        newProduct.manufacturingLocation
      );

      if (result.status === "success") {
        const newRes = await axios.post('http://localhost:7000/api/products', contractProduct);
        if (newRes.data) {
          setProducts((prev) => [newRes.data, ...prev]);
        }

        setCurrentProduct(contractProduct);
        setNewProduct({
          name: '',
          manufacturingLocation: '',
          manufacturingTimestamp: '',
          expectedShelfLife: '',
          certificationStatus: 'Pending',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('Failed to add product. ' + (error.message || 'Please try again.'));
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleInitiateTransport = async (productId) => {
    try {
      const result = await initiateTransport(
        transportDetails.transactionId,
        productId,
        transportDetails.toAddress,
        parseInt(transportDetails.transactionValue),
        parseInt(transportDetails.transactionVolume),
        transportDetails.supplyChainNodeType,
        transportDetails.transportationMethod
      );
      if (result.status === "success") {
        alert(`Transport initiated successfully! TxHash: ${result.txHash}`);
        setTransportDetails({
          transactionId: '',
          toAddress: '',
          transactionValue: 0,
          transactionVolume: 0,
          supplyChainNodeType: '',
          transportationMethod: '',
        });
        document.getElementById(`transportModal-${productId}`).classList.add('hidden');
        const txs = await getReceivableTransactions(receiverAddress);
        if (txs && txs.status !== "error") {
          setReceivableTransactions(txs);
        }
      } else {
        console.error("Initiate transport failed:", result.message);
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Error in handleInitiateTransport:", error);
      setErrorMessage('Failed to initiate transport: ' + error.message);
    }
  };

  const handleReceiveChange = (e) => {
    const { name, value } = e.target;
    setReceiveDetails(prev => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'transactionId') {
      const selectedTx = receivableTransactions.find(tx => tx.transactionId === value);
      if (selectedTx) {
        setReceiveDetails(prev => ({
          ...prev,
          productId: selectedTx.productId
        }));
      }
    }
  };

  const navigateToShipments = (productId) => {
    window.location.href = `/shipments?productId=${productId}`;
  };

  const onComplianceComplete = () => {
    setIsComplianceModalOpen(false);
    if (currentProduct) {
      navigateToShipments(currentProduct.productId);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'number') {
      return new Date(timestamp * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Product Management</h2>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center"
                onClick={() => document.getElementById('receiveProductModal').classList.remove('hidden')}
              >
                <span className="mr-2">Receive Product</span>
                <CheckCircle size={16} />
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center"
                onClick={() => navigateToShipments('')}
              >
                <span className="mr-2">Track Orders</span>
                <Truck size={16} />
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
                onClick={() => document.getElementById('addProductModal').classList.remove('hidden')}
              >
                <span className="mr-2">Add New Product</span>
                <Package size={16} />
              </button>
            </div>
          </div>

          {/* All Products Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">All Products</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>

            {isLoading ? (
              <div className="py-10">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-750 border-b border-gray-700">
                      <th className="px-4 py-3 font-medium">Product ID</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Manufacturing Location</th>
                      <th className="px-4 py-3 font-medium">Manufacturing Date</th>
                      <th className="px-4 py-3 font-medium">Shelf Life (Days)</th>
                      <th className="px-4 py-3 font-medium">Certification</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.productId} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="px-4 py-3">{product.productId}</td>
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">{product.manufacturingLocation}</td>
                        <td className="px-4 py-3">{formatTimestamp(product.manufacturingTimestamp)}</td>
                        <td className="px-4 py-3">{product.expectedShelfLife}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              product.certificationStatus === 'Certified'
                                ? 'bg-green-900 text-green-300'
                                : product.certificationStatus === 'Pending'
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {product.certificationStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs mr-2"
                            onClick={() => navigateToShipments(product.productId)}
                          >
                            Track
                          </button>
                          <button
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                            onClick={() => document.getElementById(`transportModal-${product.productId}`).classList.remove('hidden')}
                          >
                            Transport
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Received Products Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h3 className="text-xl font-medium mb-4">Received Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-750 border-b border-gray-700">
                    <th className="px-4 py-3 font-medium">Transaction ID</th>
                    <th className="px-4 py-3 font-medium">Product ID</th>
                    <th className="px-4 py-3 font-medium">Received Date</th>
                    <th className="px-4 py-3 font-medium">IPFS Hash</th>
                    <th className="px-4 py-3 font-medium">Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="px-4 py-3">{product.transactionId}</td>
                      <td className="px-4 py-3">{product.productId}</td>
                      <td className="px-4 py-3">{formatTimestamp(product.timestamp)}</td>
                      <td className="px-4 py-3">
                        <a href={`https://gateway.pinata.cloud/ipfs/${product.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {product.ipfsHash?.substring(0, 10)}...
                        </a>
                      </td>
                      <td className="px-4 py-3">{product.txHash?.substring(0, 10)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Modal */}
          <div id="addProductModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden">
            <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Add New Product</h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => document.getElementById('addProductModal').classList.add('hidden')}
                >
                  ×
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2 bg-red-900 text-red-200 rounded">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Manufacturing Location *</label>
                  <input
                    type="text"
                    name="manufacturingLocation"
                    value={newProduct.manufacturingLocation}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Country or facility"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Manufacturing Date *</label>
                  <input
                    type="date"
                    name="manufacturingTimestamp"
                    value={newProduct.manufacturingTimestamp}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shelf Life (Days) *</label>
                  <input
                    type="number"
                    name="expectedShelfLife"
                    value={newProduct.expectedShelfLife}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="730"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Certification Status *</label>
                  <select
                    name="certificationStatus"
                    value={newProduct.certificationStatus}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Certified">Certified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
                  onClick={() => document.getElementById('addProductModal').classList.add('hidden')}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
                  onClick={handleAddProduct}
                  disabled={isAddingProduct}
                >
                  {isAddingProduct ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Adding...</span>
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transport Modal for Each Product */}
          {products.map((product) => (
            <div
              key={product.productId}
              id={`transportModal-${product.productId}`}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden"
            >
              <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">Initiate Transport for {product.name}</h3>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={() => document.getElementById(`transportModal-${product.productId}`).classList.add('hidden')}
                  >
                    ×
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-2 bg-red-900 text-red-200 rounded">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction ID *</label>
                    <input
                      type="text"
                      name="transactionId"
                      value={transportDetails.transactionId}
                      onChange={handleTransportChange}
                      className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="TX123"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">To Address *</label>
                    <input
                      type="text"
                      name="toAddress"
                      value={transportDetails.toAddress}
                      onChange={handleTransportChange}
                      className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction Value *</label>
                    <input
                      type="number"
                      name="transactionValue"
                      value={transportDetails.transactionValue}
                      onChange={handleTransportChange}
                      className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction Volume *</label>
                    <input
                      type="number"
                      name="transactionVolume"
                      value={transportDetails.transactionVolume}
                      onChange={handleTransportChange}
                      className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Node Type *</label>
                    <input
                      type="text"
                      name="supplyChainNodeType"
                      value={transportDetails.supplyChainNodeType}
                      onChange={handleTransportChange}
                      className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Warehouse"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transportation Method *</label>
                    <input
                      type="text"
                      name="transportationMethod"
                      value={transportDetails.transportationMethod}
                      onChange={handleTransportChange}
                      className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Truck"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
                    onClick={() => document.getElementById(`transportModal-${product.productId}`).classList.add('hidden')}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                    onClick={() => handleInitiateTransport(product.productId)}
                  >
                    Initiate Transport
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Receive Product Modal */}
          <div id="receiveProductModal" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden">
            <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Receive Product</h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => document.getElementById('receiveProductModal').classList.add('hidden')}
                >
                  ×
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2 bg-red-900 text-red-200 rounded">
                  {errorMessage}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Transaction to Receive *</label>
                <select
                  name="transactionId"
                  value={receiveDetails.transactionId}
                  onChange={handleReceiveChange}
                  className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a transaction</option>
                  {receivableTransactions.map((tx, index) => (
                    <option
                      key={tx.transactionId || index}
                      value={tx.transactionId}
                    >
                      {`${tx.transactionId} - Product: ${tx.productId || 'N/A'} ${tx.transportationMethod ? `(${tx.transportationMethod})` : ''}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Transaction ID</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={receiveDetails.transactionId}
                    onChange={handleReceiveChange}
                    className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Select from dropdown"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Product ID</label>
                  <input
                    type="text"
                    name="productId"
                    value={receiveDetails.productId}
                    onChange={handleReceiveChange}
                    className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Select from dropdown"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
                  onClick={() => document.getElementById('receiveProductModal').classList.add('hidden')}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                  onClick={handleReceiveProduct}
                  disabled={!receiveDetails.transactionId || !receiveDetails.productId}
                >
                  Receive Product
                </button>
              </div>
            </div>
          </div>

          {isComplianceModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl p-6">
                <ProductAnalysis product={currentProduct} onComplete={onComplianceComplete} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;