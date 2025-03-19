
import React, { useState } from 'react';

const FraudDetectionPage = () => {
  // Initial fraud cases data
  const [fraudCases, setFraudCases] = useState([
    {
      id: 1,
      transactionId: "TX78945612",
      amount: "$2,500.00",
      date: "2023-11-15",
      description: "Suspicious online purchase from unrecognized IP",
      category: "Card Fraud",
      status: "Investigating",
      severity: "High",
      icon: "🚨",
      color: "bg-red-500",
      flagged: true
    },
    {
      id: 2,
      transactionId: "TX36452189",
      amount: "$750.00",
      date: "2023-11-14",
      description: "Multiple failed login attempts before transaction",
      category: "Account Takeover",
      status: "Resolved",
      severity: "Medium",
      icon: "⚠",
      color: "bg-orange-500",
      flagged: false
    },
    {
      id: 3,
      transactionId: "TX96325871",
      amount: "$4,200.00",
      date: "2023-11-13",
      description: "Transaction from blocked country",
      category: "Geo-blocking Violation",
      status: "Confirmed Fraud",
      severity: "High",
      icon: "🔒",
      color: "bg-red-700",
      flagged: true
    },
    // Generate more fraud case data
    ...Array.from({ length: 97 }, (_, i) => {
      const severities = ["Low", "Medium", "High"];
      const severity = severities[Math.floor(Math.random() * 3)];
      
      const statuses = ["Investigating", "Resolved", "Confirmed Fraud", "False Positive"];
      const status = statuses[Math.floor(Math.random() * 4)];
      
      const categories = ["Card Fraud", "Identity Theft", "Account Takeover", "Phishing", "Money Laundering"];
      const category = categories[Math.floor(Math.random() * 5)];
      
      let icon, color;
      if (severity === "High") {
        icon = "🚨";
        color = "bg-red-500";
      } else if (severity === "Medium") {
        icon = "⚠";
        color = "bg-orange-500";
      } else {
        icon = "ℹ";
        color = "bg-blue-500";
      }

      return {
        id: i + 4,
        transactionId: `TX${Math.floor(10000000 + Math.random() * 90000000)}`,
        amount: `$${(Math.random() * 10000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        description: `Suspicious activity detected on transaction ${i + 4}`,
        category,
        status,
        severity,
        icon,
        color,
        flagged: Math.random() < 0.3
      };
    })
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list');
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredCases = fraudCases.filter(c => 
    (c.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'All' || c.status === filterStatus)
  );

  const handleAddCase = (newCase) => {
    setFraudCases([...fraudCases, { ...newCase, id: Date.now(), flagged: false }]);
    setView('list');
  };

  const toggleFlag = (id) => {
    setFraudCases(fraudCases.map(c => 
      c.id === id ? { ...c, flagged: !c.flagged } : c
    ));
    
    // If we're in details view, update the selected case too
    if (view === 'details' && selectedCase && selectedCase.id === id) {
      setSelectedCase({
        ...selectedCase,
        flagged: !selectedCase.flagged
      });
    }
  };

  // Case Card Component
  const FraudCaseCard = ({ fraudCase, onToggleFlag, onViewDetails }) => (
    <div className="border-b border-gray-700 p-3 hover:bg-blue-900/40 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => onViewDetails(fraudCase)}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${fraudCase.color} text-white`}>
            {fraudCase.icon}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-200">{fraudCase.transactionId}</div>
            <div className="text-sm text-gray-400">
              {fraudCase.date} • {fraudCase.amount}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded text-xs mr-2 ${
            fraudCase.status === "Investigating" ? "bg-yellow-900 text-yellow-200" :
            fraudCase.status === "Confirmed Fraud" ? "bg-red-900 text-red-200" :
            fraudCase.status === "Resolved" ? "bg-green-900 text-green-200" :
            "bg-gray-700 text-gray-200"
          }`}>
            {fraudCase.status}
          </span>
          <button 
            onClick={() => onToggleFlag(fraudCase.id)}
            className="text-xl hover:scale-110 transition-transform"
            style={{ color: fraudCase.flagged ? '#ef4444' : '#6b7280' }}
          >
            🚩
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-300 line-clamp-2">
        {fraudCase.description}
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <div className={`px-2 py-1 rounded ${
          fraudCase.severity === "High" ? "bg-red-900 text-red-200" :
          fraudCase.severity === "Medium" ? "bg-orange-900 text-orange-200" :
          "bg-blue-900 text-blue-200"
        }`}>
          {fraudCase.severity} Risk
        </div>
        <div className="text-gray-400">
          {fraudCase.category}
        </div>
      </div>
    </div>
  );

  // Add Case Form Component
  const ReportFraudForm = ({ onAddCase, onCancel }) => {
    const [formData, setFormData] = useState({
      transactionId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Card Fraud',
      status: 'Investigating',
      severity: 'Medium',
      icon: '⚠',
      color: 'bg-orange-500'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onAddCase(formData);
    };

    const handleSeverityChange = (severity) => {
      let icon, color;
      
      if (severity === "High") {
        icon = "🚨";
        color = "bg-red-500";
      } else if (severity === "Medium") {
        icon = "⚠";
        color = "bg-orange-500";
      } else {
        icon = "ℹ";
        color = "bg-blue-500";
      }

      setFormData({ ...formData, severity, icon, color });
    };

    const categories = ["Card Fraud", "Identity Theft", "Account Takeover", "Phishing", "Money Laundering"];

    return (
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <button 
          type="button"
          onClick={onCancel} 
          className="flex items-center mb-4 text-gray-300 hover:text-gray-100 transition-colors"
        >
          ← Back
        </button>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Risk Severity</label>
          <div className="flex gap-2">
            {['Low', 'Medium', 'High'].map(severity => (
              <button
                key={severity}
                type="button"
                onClick={() => handleSeverityChange(severity)}
                className={`px-3 py-1 rounded ${
                  severity === "High" ? "bg-red-900 text-red-200 hover:bg-red-800" :
                  severity === "Medium" ? "bg-orange-900 text-orange-200 hover:bg-orange-800" :
                  "bg-blue-900 text-blue-200 hover:bg-blue-800"
                } ${formData.severity === severity ? 'ring-2 ring-blue-400' : ''}`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Transaction ID</label>
          <input
            type="text"
            value={formData.transactionId}
            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter transaction ID..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Amount</label>
          <input
            type="text"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter amount (e.g. $1,000.00)..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Describe the suspicious activity..."
            rows={3}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Report Fraud Case
        </button>
      </form>
    );
  };

  // Case Details Component
  const CaseDetails = ({ fraudCase, onBack, onToggleFlag }) => (
    <div className="p-4">
      <button 
        onClick={onBack} 
        className="flex items-center mb-4 text-gray-300 hover:text-gray-100 transition-colors"
      >
        ← Back
      </button>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${fraudCase.color} text-white text-xl`}>
              {fraudCase.icon}
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold text-gray-100">{fraudCase.transactionId}</h2>
              <div className="text-sm text-gray-400">
                Reported on {fraudCase.date}
              </div>
            </div>
          </div>
          <button
            onClick={() => onToggleFlag(fraudCase.id)}
            className={`p-2 rounded-full ${
              fraudCase.flagged 
                ? 'bg-red-900/50 text-red-200 hover:bg-red-800/50' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="text-lg">🚩</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-900/30 rounded-lg">
          <div>
            <div className="text-sm text-gray-400">Amount</div>
            <div className="font-semibold text-gray-200">{fraudCase.amount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Category</div>
            <div className="font-semibold text-gray-200">{fraudCase.category}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Status</div>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              fraudCase.status === "Investigating" ? "bg-yellow-900 text-yellow-200" :
              fraudCase.status === "Confirmed Fraud" ? "bg-red-900 text-red-200" :
              fraudCase.status === "Resolved" ? "bg-green-900 text-green-200" :
              "bg-gray-700 text-gray-200"
            }`}>
              {fraudCase.status}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Risk Level</div>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              fraudCase.severity === "High" ? "bg-red-900 text-red-200" :
              fraudCase.severity === "Medium" ? "bg-orange-900 text-orange-200" :
              "bg-blue-900 text-blue-200"
            }`}>
              {fraudCase.severity}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
          <div className="p-3 bg-blue-900/30 rounded-lg text-gray-200">
            {fraudCase.description}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-medium mb-3 text-gray-200">Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2 rounded-lg bg-red-700 text-white hover:bg-red-600 transition-colors">
              Escalate Case
            </button>
            <button className="py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors">
              Request Documents
            </button>
            <button className="py-2 rounded-lg bg-green-700 text-white hover:bg-green-600 transition-colors">
              Mark as Resolved
            </button>
            <button className="py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              Archive Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NoCasesFound = () => (
    <div className="py-10 text-center text-gray-400">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-lg font-medium">No fraud cases found</p>
      <p className="mt-1">Try a different search term or report a new case</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-blue-900 text-white shadow sticky top-0 z-10">
        <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">
            Fraud Detection Center
          </h1>
          <p className="mt-1 text-blue-100">
            Monitor, detect and investigate potential fraudulent activities
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {view === 'list' && (
          <>
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Search by ID, description or category..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-72 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Confirmed Fraud">Confirmed Fraud</option>
                    <option value="Resolved">Resolved</option>
                    <option value="False Positive">False Positive</option>
                  </select>
                </div>
                <button
                  onClick={() => setView('add')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Report New Case
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-300">
                <div>
                  <span className="font-medium">{filteredCases.length}</span> case{filteredCases.length !== 1 ? 's' : ''} found
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-1"></span>
                    <span>High Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-orange-500 inline-block mr-1"></span>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-1"></span>
                    <span>Low Risk</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
              {filteredCases.length > 0 ? (
                filteredCases.map(fraudCase => (
                  <FraudCaseCard
                    key={fraudCase.id}
                    fraudCase={fraudCase}
                    onToggleFlag={toggleFlag}
                    onViewDetails={fraudCase => {
                      setSelectedCase(fraudCase);
                      setView('details');
                    }}
                  />
                ))
              ) : (
                <NoCasesFound />
              )}
            </div>
          </>
        )}

        {view === 'add' && (
          <div className="bg-gray-800 rounded-lg shadow">
            <ReportFraudForm
              onAddCase={handleAddCase}
              onCancel={() => setView('list')}
            />
          </div>
        )}

        {view === 'details' && selectedCase && (
          <div className="bg-gray-800 rounded-lg shadow">
            <CaseDetails
              fraudCase={selectedCase}
              onBack={() => setView('list')}
              onToggleFlag={toggleFlag}
            />
          </div>
        )}
      </main>

      <footer className="bg-blue-900 text-white mt-auto py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          © {new Date().getFullYear()} Fraud Detection System | For authorized personnel only
        </div>
      </footer>
    </div>
  );
};

export default FraudDetectionPage;

