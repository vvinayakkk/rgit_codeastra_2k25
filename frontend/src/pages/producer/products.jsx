import React, { useState, useEffect } from 'react';
import { Package, Shield, CheckCircle, AlertTriangle, Clock, Truck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';

function Products() {
    const navigate = useNavigate();
    const [newProduct, setNewProduct] = useState({
        productid: '',
        name: '',
        manufacturingLocation: '',
        manufacturingTimestamp: '',
        expectedShelfLife: '',
        certificationStatus: 'Pending',
        ipfsHash: '',
        destination: ''
    });
    const [products, setProducts] = useState([]);
    const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
      
    // Simulate fetching products from blockchain
    useEffect(() => {
        const demoProducts = [
            { 
                productid: 'PRD-3452-XY', 
                name: 'Laptop', 
                manufacturingLocation: 'China', 
                manufacturingTimestamp: 1673456400, 
                expectedShelfLife: 730, 
                certificationStatus: 'Certified',
                ipfsHash: 'QmXyZ123456789abcdef',
                status: 'Verified',
                destination: 'US-NYC-WH3',
                compliance: 'Passed', 
                displayTimestamp: '2025-03-17T14:22:18' 
            },
            { 
                productid: 'PRD-7890-AB', 
                name: 'Smartphone', 
                manufacturingLocation: 'Vietnam', 
                manufacturingTimestamp: 1685321400, 
                expectedShelfLife: 730, 
                certificationStatus: 'Pending',
                ipfsHash: 'QmABC123456789defghi',
                status: 'Pending',
                destination: 'UK-LDN-WH1',
                compliance: 'In Review', 
                displayTimestamp: '2025-03-18T09:15:42' 
            },
            { 
                productid: 'PRD-1234-CD', 
                name: 'Tablet', 
                manufacturingLocation: 'Taiwan', 
                manufacturingTimestamp: 1679256400, 
                expectedShelfLife: 730, 
                certificationStatus: 'Certified',
                ipfsHash: 'QmDEF123456789ghijkl',
                status: 'Verified',
                destination: 'DE-BER-WH2',
                compliance: 'Passed', 
                displayTimestamp: '2025-03-17T11:05:33' 
            },
            { 
                productid: 'PRD-5678-EF', 
                name: 'Smart Watch', 
                manufacturingLocation: 'Malaysia', 
                manufacturingTimestamp: 1682991400, 
                expectedShelfLife: 730, 
                certificationStatus: 'Rejected',
                ipfsHash: 'QmGHI123456789jklmno',
                status: 'Blocked',
                destination: 'FR-PAR-WH4',
                compliance: 'Failed', 
                displayTimestamp: '2025-03-16T16:48:27' 
            },
        ];
        setProducts(demoProducts);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value
        });
    };

    const handleAddProduct = () => {
        // Generate a unique product ID if not provided
        const productId = newProduct.productid || `PRD-${Math.floor(Math.random() * 10000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
        
        // Convert date to Unix timestamp if provided as date
        let manufacturingTimestamp = newProduct.manufacturingTimestamp;
        if (manufacturingTimestamp && typeof manufacturingTimestamp === 'string' && manufacturingTimestamp.includes('-')) {
            manufacturingTimestamp = Math.floor(new Date(manufacturingTimestamp).getTime() / 1000);
        }

        // Prepare the product data for the contract
        const contractProduct = {
            productid: productId,
            name: newProduct.name,
            manufacturingLocation: newProduct.manufacturingLocation,
            manufacturingTimestamp: manufacturingTimestamp || Math.floor(Date.now() / 1000),
            expectedShelfLife: parseInt(newProduct.expectedShelfLife) || 730,
            certificationStatus: newProduct.certificationStatus || 'Pending',
            ipfsHash: newProduct.ipfsHash || `QmTemp${Math.random().toString(36).substring(2, 10)}`
        };
        
        // Additional UI-specific fields
        const uiProduct = {
            ...contractProduct,
            status: 'Pending',
            compliance: 'Not Started',
            displayTimestamp: new Date().toISOString(),
            destination: newProduct.destination || 'Not Specified'
        };
        
        console.log("Sending to contract:", contractProduct);
        // In a real app, you would send this to the contract:
        // await contract.methods.addProduct(contractProduct).send({ from: accounts[0] });
        
        setProducts([uiProduct, ...products]);
        setNewProduct({
            productid: '',
            name: '',
            manufacturingLocation: '',
            manufacturingTimestamp: '',
            expectedShelfLife: '',
            certificationStatus: 'Pending',
            ipfsHash: '',
            destination: ''
        });
        setCurrentProduct(uiProduct);
        checkCompliance(uiProduct);
    };
    
    const checkCompliance = (product) => {
        setIsComplianceModalOpen(true);
    };

    const navigateToShipments = (productId) => {
        // Navigate to shipments page with the product ID as a parameter
        navigate(`/shipments?productId=${productId}`);
    };

    const onComplianceComplete = () => {
        setIsComplianceModalOpen(false);
        // Navigate to shipments page after compliance check
        if (currentProduct) {
            navigateToShipments(currentProduct.productid);
        }
    };

    // Format timestamp to readable date
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        
        // Check if it's a Unix timestamp (seconds since epoch)
        if (typeof timestamp === 'number') {
            return new Date(timestamp * 1000).toLocaleString();
        }
        
        // If it's already a date string
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />
                
                {/* Products Content */}
                <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Product Management</h2>
                            <div className="flex space-x-4">
                                <button 
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center"
                                    onClick={() => navigate('/shipments')}
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
                        
                        {/* Full Product Table */}
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
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Destination</th>
                                            <th className="px-4 py-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.productid} className="border-b border-gray-700 hover:bg-gray-750">
                                                <td className="px-4 py-3">{product.productid}</td>
                                                <td className="px-4 py-3">{product.name}</td>
                                                <td className="px-4 py-3">{product.manufacturingLocation}</td>
                                                <td className="px-4 py-3">{formatTimestamp(product.manufacturingTimestamp)}</td>
                                                <td className="px-4 py-3">{product.expectedShelfLife}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        product.certificationStatus === 'Certified' ? 'bg-green-900 text-green-300' : 
                                                        product.certificationStatus === 'Pending' ? 'bg-yellow-900 text-yellow-300' : 
                                                        'bg-red-900 text-red-300'
                                                    }`}>
                                                        {product.certificationStatus}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        product.status === 'Verified' ? 'bg-green-900 text-green-300' : 
                                                        product.status === 'Pending' ? 'bg-yellow-900 text-yellow-300' : 
                                                        'bg-red-900 text-red-300'
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{product.destination}</td>
                                                <td className="px-4 py-3">
                                                    <button 
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                                                        onClick={() => navigateToShipments(product.productid)}
                                                    >
                                                        Track
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* Add Product Modal - Modified for better fit */}
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
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Product ID</label>
                                        <input
                                            type="text"
                                            name="productid"
                                            value={newProduct.productid}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Auto-generated if blank"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newProduct.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Manufacturing Location</label>
                                        <input
                                            type="text"
                                            name="manufacturingLocation"
                                            value={newProduct.manufacturingLocation}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Country or facility"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Manufacturing Date</label>
                                        <input
                                            type="date"
                                            name="manufacturingTimestamp"
                                            value={newProduct.manufacturingTimestamp}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Shelf Life (Days)</label>
                                        <input
                                            type="number"
                                            name="expectedShelfLife"
                                            value={newProduct.expectedShelfLife}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="730"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Certification Status</label>
                                        <select
                                            name="certificationStatus"
                                            value={newProduct.certificationStatus}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Certified">Certified</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">IPFS Hash</label>
                                        <input
                                            type="text"
                                            name="ipfsHash"
                                            value={newProduct.ipfsHash}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="QmXyZ... (Pinata upload)"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Destination</label>
                                        <input
                                            type="text"
                                            name="destination"
                                            value={newProduct.destination}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. US-NYC-WH3"
                                        />
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
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                        onClick={() => {
                                            handleAddProduct();
                                            document.getElementById('addProductModal').classList.add('hidden');
                                        }}
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Compliance Modal */}
                        {isComplianceModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                                <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-medium">Compliance Check</h3>
                                        <button 
                                            className="text-gray-400 hover:text-white"
                                            onClick={() => setIsComplianceModalOpen(false)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Shield className="text-blue-400" size={24} />
                                            <h4 className="text-lg font-medium">AI Compliance Verification</h4>
                                        </div>
                                        <p className="text-center text-gray-400 mt-2">
                                            Verifying product against regulatory requirements
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                                            <CheckCircle className="text-green-400 mr-3" size={20} />
                                            <div>
                                                <p className="font-medium">Product Classification</p>
                                                <p className="text-sm text-gray-400">Product has been correctly classified</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                                            <CheckCircle className="text-green-400 mr-3" size={20} />
                                            <div>
                                                <p className="font-medium">Origin Verification</p>
                                                <p className="text-sm text-gray-400">Product origin has been verified on blockchain</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                                            <AlertTriangle className="text-yellow-400 mr-3" size={20} />
                                            <div>
                                                <p className="font-medium">Import Restrictions</p>
                                                <p className="text-sm text-gray-400">Additional documentation required</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                                            <Clock className="text-blue-400 mr-3" size={20} />
                                            <div>
                                                <p className="font-medium">AI Fraud Detection</p>
                                                <p className="text-sm text-gray-400">Analyzing transaction patterns...</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button 
                                            className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
                                            onClick={() => setIsComplianceModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                            onClick={onComplianceComplete}
                                        >
                                            Complete & Ship
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Products;