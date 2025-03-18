import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar'; // Adjust path as needed
import Header from '../components/header'; // Adjust path as needed
import { receiveProduct, trackProduct } from '../utils/SuppyChain'; // Adjust path as needed

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

function Receive() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReceiving, setIsReceiving] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch transactions where the user is the receiver
  const fetchReceivableTransactions = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // For simplicity, fetch all products and filter transactions
      // In a real app, you'd query the backend or contract for user-specific data
      const productIds = ["PRD-1234-AB", "PRD-5678-CD"]; // Replace with dynamic list from backend/contract
      const allTransactions = await Promise.all(productIds.map(id => trackProduct(id)));
      
      const userAddress = await window.ethereum.request({ method: "eth_accounts" });
      const receivableTxs = allTransactions
        .flatMap(result => result.transactions || [])
        .filter(tx => 
          tx.receiver.toLowerCase() === userAddress[0].toLowerCase() &&
          tx.status === "Initiated" // Only show transactions that haven't been received
        );

      setTransactions(receivableTxs);
    } catch (error) {
      console.error('Error fetching receivable transactions:', error);
      setErrorMessage('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivableTransactions();
  }, []);

  const handleReceiveProduct = async (transactionId, productId) => {
    setIsReceiving(prev => ({ ...prev, [transactionId]: true }));
    setErrorMessage('');
    try {
      const result = await receiveProduct(transactionId, productId);
      if (result.status === "success") {
        alert("Product received successfully! Tx Hash: " + result.txHash);
        // Refresh the transaction list
        await fetchReceivableTransactions();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error receiving product:', error);
      setErrorMessage('Failed to receive product: ' + (error.message || 'Unknown error'));
    } finally {
      setIsReceiving(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Receive Products</h2>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center"
                onClick={() => navigate('/shipments')}
              >
                <span className="mr-2">View Shipments</span>
                <Truck size={16} />
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-medium mb-4">Pending Receipts</h3>

              {errorMessage && (
                <div className="mb-4 p-2 bg-red-900 text-red-200 rounded">
                  {errorMessage}
                </div>
              )}

              {isLoading ? (
                <div className="py-10">
                  <LoadingSpinner />
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-gray-400">No products available to receive.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-750 border-b border-gray-700">
                        <th className="px-4 py-3 font-medium">Transaction ID</th>
                        <th className="px-4 py-3 font-medium">Product ID</th>
                        <th className="px-4 py-3 font-medium">Sender</th>
                        <th className="px-4 py-3 font-medium">Transport Method</th>
                        <th className="px-4 py-3 font-medium">Timestamp</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(tx => (
                        <tr key={tx.transactionId} className="border-b border-gray-700 hover:bg-gray-750">
                          <td className="px-4 py-3">{tx.transactionId}</td>
                          <td className="px-4 py-3">{tx.productId}</td>
                          <td className="px-4 py-3">{tx.sender.slice(0, 6)}...{tx.sender.slice(-4)}</td>
                          <td className="px-4 py-3">{tx.transportationMethod}</td>
                          <td className="px-4 py-3">{new Date(tx.timestamp * 1000).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <button
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs flex items-center"
                              onClick={() => handleReceiveProduct(tx.transactionId, tx.productId)}
                              disabled={isReceiving[tx.transactionId]}
                            >
                              {isReceiving[tx.transactionId] ? (
                                <>
                                  <LoadingSpinner />
                                  <span className="ml-2">Receiving...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={14} className="mr-1" />
                                  Receive
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Receive;
