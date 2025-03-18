import React, { useState } from 'react';
import { Shield, CheckCircle, Lock, FileText, Clock, Hash, Database, Network, AlertTriangle, Code } from 'lucide-react';

const BlockchainValidationDashboard = () => {
  const [activeTab, setActiveTab] = useState('verification');
  
  const transactionData = [
    { timestamp: '08:15:23', hash: '0x7f2c8d4e6f...', event: 'Package Initialized', status: 'Confirmed', block: 14752863 },
    { timestamp: '08:42:17', hash: '0x3a9b1c7d2e...', event: 'Hop 1 Completed', status: 'Confirmed', block: 14752894 },
    { timestamp: '09:31:05', hash: '0x8e5f2c1d9a...', event: 'Hop 2 Completed', status: 'Confirmed', block: 14752944 },
    { timestamp: '10:14:22', hash: '0x6b3c4d5e2f...', event: 'Hop 3 Completed', status: 'Confirmed', block: 14753012 },
    { timestamp: '10:52:38', hash: '0x1a2b3c4d5e...', event: 'Delivery Completed', status: 'Confirmed', block: 14753063 }
  ];
  
  const verficationResults = [
    { type: 'Digital Signature', status: 'Valid', details: 'ECDSA signature verified successfully', confidence: 100 },
    { type: 'Chain of Custody', status: 'Complete', details: 'All handoffs properly recorded and timestamped', confidence: 100 },
    { type: 'Smart Contract Execution', status: 'Valid', details: 'Contract execution verified on blockchain', confidence: 100 },
    { type: 'Consensus Validation', status: 'Valid', details: 'Transaction validated by 154 nodes', confidence: 100 },
    { type: 'Timestamping', status: 'Valid', details: 'Proof of time verified by network', confidence: 100 },
    { type: 'Data Integrity', status: 'Valid', details: 'Hash consistency maintained throughout transport', confidence: 100 }
  ];
  
  const hopVerificationData = [
    {
      hop: 1,
      hash: '0x3a9b1c7d2e...',
      carrierSignature: '0x7d9e1f2c3b4a5d6e...',
      receiverSignature: '0x2c3d4e5f6a7b8c9d...',
      geolocation: { lat: 19.0760, lng: 72.8777 },
      timestamp: '2025-03-19 08:42:17',
      smartContractValidation: 'Passed',
      blockHeight: 14752894,
      merkleProof: 'Valid'
    },
    {
      hop: 2,
      hash: '0x8e5f2c1d9a...',
      carrierSignature: '0x2c3d4e5f6a7b8c9d...',
      receiverSignature: '0x9a8b7c6d5e4f3g2h...',
      geolocation: { lat: 19.1136, lng: 72.9010 },
      timestamp: '2025-03-19 09:31:05',
      smartContractValidation: 'Passed',
      blockHeight: 14752944,
      merkleProof: 'Valid'
    },
    {
      hop: 3,
      hash: '0x6b3c4d5e2f...',
      carrierSignature: '0x9a8b7c6d5e4f3g2h...',
      receiverSignature: '0x5f4e3d2c1b0a9z8y...',
      geolocation: { lat: 19.1620, lng: 72.9511 },
      timestamp: '2025-03-19 10:14:22',
      smartContractValidation: 'Passed',
      blockHeight: 14753012,
      merkleProof: 'Valid'
    }
  ];

  const [selectedHop, setSelectedHop] = useState(1);
  const selectedHopData = hopVerificationData.find(h => h.hop === selectedHop) || hopVerificationData[0];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Blockchain Validation Dashboard</h1>
        <p className="text-gray-600">Package ID: PRD-3452-XY • RFID: RFID-123456788 • IPFS Hash: Qmg1mrkd5d61</p>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'verification' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('verification')}
            >
              Verification Results
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'transactions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('transactions')}
            >
              Blockchain Transactions
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'hop' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('hop')}
            >
              Hop Verification
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'smart' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('smart')}
            >
              Smart Contract Details
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'verification' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Package Verification Summary</h2>
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <CheckCircle size={18} />
                  <span className="font-medium">All Verifications Passed</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {verficationResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">{result.type}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${result.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{result.details}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Confidence</span>
                      <span>{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start mb-2">
                  <Shield className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-800">Blockchain Proof Status</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      This package has been cryptographically verified through our blockchain network with 154 consensus nodes.
                      All transactions have been immutably recorded and can be independently verified through the public ledger.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center text-sm text-blue-800">
                    <Lock size={14} className="mr-1" />
                    <span>Secured by BlockTrace™ Advanced Cryptography</span>
                  </div>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View Public Certificate
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Blockchain Transaction History</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Block
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactionData.map((tx, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tx.event}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          <div className="flex items-center">
                            <Hash className="mr-1" size={14} />
                            <span>{tx.hash}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.block}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-800">Transaction Finality Notice</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      All transactions have received more than 150 confirmations and are considered final. 
                      These records are now permanently stored on the blockchain and cannot be altered.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'hop' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Transit Hop Verification</h2>
              
              <div className="flex space-x-4 mb-6">
                {hopVerificationData.map((hop) => (
                  <button
                    key={hop.hop}
                    className={`py-2 px-4 rounded-md ${selectedHop === hop.hop ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setSelectedHop(hop.hop)}
                  >
                    Hop {hop.hop}
                  </button>
                ))}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Hash</span>
                        <span className="font-mono text-gray-800">{selectedHopData.hash}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp</span>
                        <span className="text-gray-800">{selectedHopData.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Block Height</span>
                        <span className="text-gray-800">{selectedHopData.blockHeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Merkle Proof</span>
                        <span className="text-green-600 font-medium">{selectedHopData.merkleProof}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Smart Contract Validation</span>
                        <span className="text-green-600 font-medium">{selectedHopData.smartContractValidation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Signatures & Verification</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-gray-600 mr-2">Carrier Signature</span>
                          <CheckCircle className="text-green-500" size={16} />
                        </div>
                        <code className="block bg-gray-100 p-2 rounded text-xs font-mono truncate">
                          {selectedHopData.carrierSignature}
                        </code>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-gray-600 mr-2">Receiver Signature</span>
                          <CheckCircle className="text-green-500" size={16} />
                        </div>
                        <code className="block bg-gray-100 p-2 rounded text-xs font-mono truncate">
                          {selectedHopData.receiverSignature}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">Geolocation</span>
                        <div className="bg-gray-100 p-2 rounded">
                          <div className="text-xs">
                            <span className="font-medium">Lat:</span> {selectedHopData.geolocation.lat.toFixed(4)}, 
                            <span className="font-medium ml-2">Lng:</span> {selectedHopData.geolocation.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'smart' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Smart Contract Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Code className="text-purple-600 mr-2" size={20} />
                    <h3 className="font-medium text-gray-800">Contract Address</h3>
                  </div>
                  <code className="block bg-gray-100 p-3 rounded text-sm font-mono mb-3">
                    0x7A3B4D5E6F7A8B9C1D2E3F4A5B6C7D8E9F
                  </code>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contract Type</span>
                    <span className="text-gray-700">Supply Chain Validation</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Database className="text-purple-600 mr-2" size={20} />
                    <h3 className="font-medium text-gray-800">Storage State</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Events</span>
                      <span className="text-gray-700">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Custody Transfers</span>
                      <span className="text-gray-700">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contract Status</span>
                      <span className="text-green-600 font-medium">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Locks Active</span>
                      <span className="text-gray-700">0</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Network className="text-purple-600 mr-2" size={20} />
                    <h3 className="font-medium text-gray-800">Network Status</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gas Used</span>
                      <span className="text-gray-700">254,370</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Network</span>
                      <span className="text-gray-700">Polygon Mainnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Validation Nodes</span>
                      <span className="text-gray-700">154</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Finality</span>
                      <span className="text-green-600 font-medium">100%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Contract Events</h3>
                </div>
                <div className="p-4 space-y-4">
                  {transactionData.map((tx, index) => (
                    <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="rounded-full bg-blue-100 p-2 mr-3">
                        <Clock className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-800">{tx.event}</h4>
                          <span className="ml-2 text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                            {tx.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Transaction hash: {tx.hash} • Block: {tx.block}
                        </div>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        {tx.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Verification Certificate</h2>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <FileText size={16} className="mr-2" />
            Export Certificate
          </button>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            This digital verification certificate confirms that the package with ID PRD-3452-XY 
            has been tracked and verified through our blockchain network. All custody transfers
            and package conditions have been cryptographically validated. This certificate
            serves as immutable proof of the package's journey and integrity.
          </p>
          
          <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-green-600 mr-2" size={18} />
              <span className="text-sm font-medium text-gray-700">Validated and Secured</span>
            </div>
            <div className="text-xs text-gray-500">
              Certificate ID: CERT-3452-XY-20250319
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainValidationDashboard;