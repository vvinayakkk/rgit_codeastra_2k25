import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductAnalysis = ({ product, onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedProducts, setCompletedProducts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [analysisStages, setAnalysisStages] = useState([
    { id: 1, name: 'Origin Verification', status: 'processing', icon: Shield, color: 'text-blue-400', description: 'Verifying product origin on blockchain' },
    { id: 2, name: 'Compliance Check', status: 'waiting', icon: AlertTriangle, color: 'text-yellow-400', description: 'Checking regulatory compliance' },
    { id: 3, name: 'Fraud Detection', status: 'waiting', icon: AlertCircle, color: 'text-red-400', description: 'Running AI fraud detection algorithms' }
  ]);
  const navigate = useNavigate();
  // Simulate the processing of each stage
  useEffect(() => {
    if (currentStage < analysisStages.length) {
      const timer = setTimeout(() => {
        setAnalysisStages(prev => {
          const updated = [...prev];
          if (currentStage > 0) {
            updated[currentStage - 1] = { ...updated[currentStage - 1], status: 'completed' };
          }
          updated[currentStage] = { ...updated[currentStage], status: 'processing' };
          return updated;
        });
        
        setTimeout(() => {
          setCurrentStage(prev => prev + 1);
        }, 1500);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // All stages completed
      const allCompleted = analysisStages.map(stage => ({ ...stage, status: 'completed' }));
      setAnalysisStages(allCompleted);
      
      // Add to completed products after processing
      if (product) {
        setCompletedProducts(prev => [
          { ...product, analysisCompleted: new Date().toLocaleString(), status: 'Verified' },
          ...prev
        ]);
      }
    }
  }, [currentStage, product]);

  const getStatusIcon = (status, Icon) => {
    if (status === 'completed') return <CheckCircle className="text-green-400" size={20} />;
    if (status === 'processing') return <Clock className="text-blue-400 animate-pulse" size={20} />;
    return <Icon className="text-gray-400" size={20} />;
  };

  const handleViewDetails = (stage) => {
    setShowDetails(stage.id);
  };

  const handleCloseModal = () => {
    if (currentStage >= analysisStages.length) {
      onComplete && onComplete();
    }
  };
  const handleNavigation = (name) => {
    if(name === 'Origin Verification'){
        navigate('/origin-verification');
    }else if(name === 'Compliance Check') {
        navigate('/compliance-check');
    }else if(name === 'Fraud Detection'){
        navigate('/fraud-detection');
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Product Analysis</h3>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={handleCloseModal}
          >
            ×
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="text-blue-400" size={24} />
            <h4 className="text-lg font-medium">AI-Powered Verification</h4>
          </div>
          <p className="text-center text-gray-400 mt-2">
            Processing: {product?.name || 'New Product'}
          </p>
        </div>
        
        <div className="space-y-4">
          {analysisStages.map((stage) => (
            <div 
              key={stage.id} 
              className={`flex items-center justify-between p-3 rounded-lg
                ${stage.status === 'processing' ? 'bg-blue-900 bg-opacity-20' : 'bg-gray-700'}`}
            >
              <div className="flex items-center">
                {getStatusIcon(stage.status, stage.icon)}
                <div className="ml-3">
                  <p className="font-medium">{stage.name}</p>
                  <p className="text-sm text-gray-400">{stage.description}</p>
                </div>
              </div>
              
              <button
                className={`px-2 py-1 rounded flex items-center space-x-1 
                  ${stage.status !== 'waiting' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'}`}
                disabled={stage.status === 'waiting'}
                onClick={() => handleViewDetails(stage)}
              >
                <Eye size={16} />
                <span>View</span>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${currentStage >= analysisStages.length ? 
              'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
            disabled={currentStage < analysisStages.length}
            onClick={handleCloseModal}
          >
            {currentStage >= analysisStages.length ? 'Complete & Continue' : 'Processing...'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">{analysisStages[showDetails-1]?.name} Details</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Analysis Results</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Confidence Score:</span>
                  <span className="font-medium">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification Method:</span>
                  <span className="font-medium">Blockchain + AI</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Elapsed:</span>
                  <span className="font-medium">1.2s</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Detailed Report</h4>
              <p className="text-sm text-gray-300">
                The {analysisStages[showDetails-1]?.name.toLowerCase()} process has {
                  analysisStages[showDetails-1]?.status === 'completed' ? 'completed successfully' :
                  analysisStages[showDetails-1]?.status === 'processing' ? 'begun processing' : 'not started yet'
                }. {
                  analysisStages[showDetails-1]?.status === 'completed' ?
                  'All verification checks have passed with no anomalies detected.' :
                  'This stage is currently analyzing the product data against our verified database.'
                }
              </p>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                onClick={() => setShowDetails(false)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {completedProducts.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-medium mb-4">Recently Processed Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-750 border-b border-gray-700">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Processing Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedProducts.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.analysisCompleted}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={handleNavigation(item.name)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAnalysis;