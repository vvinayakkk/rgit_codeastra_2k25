import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = "pk.eyJ1IjoiYmhhbnVoYXJzIiwiYSI6ImNtOGI0ZHR2dTFxdmcya3NmMXR1ZnhrYnYifQ.tudlNhBcrIlyw6Ez8onolQ";

const PharmaDashboard = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [communicationMessage, setCommunicationMessage] = useState('');
  const [medicines] = useState([
    {
      id: 1,
      name: "Curexifin-500",
      batchId: "BAT-1234-AB",
      rfid: "RFID-987654321",
      origin: "Andheri, Mumbai",
      destination: "Ghatkopar, Mumbai",
      status: "in-transit",
      blockchainStatus: "verified",
      blockchainHash: "0xabc123...",
      aiFraudStatus: "clean",
      aiConfidence: "0.95",
      timestamp: "2025-03-17 14:30",
      coords: { origin: [72.8479, 19.1136], destination: [72.9080, 19.0864] },
      isPublic: true,
      price: "₹499.99"
    },
    {
      id: 2,
      name: "VitaZest",
      batchId: "BAT-5678-CD",
      rfid: "RFID-123456789",
      origin: "Bandra, Mumbai",
      destination: "Thane, Mumbai",
      status: "delivered",
      blockchainStatus: "verified",
      blockchainHash: "0xdef456...",
      aiFraudStatus: "clean",
      aiConfidence: "0.98",
      timestamp: "2025-03-16 09:15",
      coords: { origin: [72.8296, 19.0596], destination: [72.9726, 19.2183] },
      isPublic: false,
      price: "₹799.99"
    },
    {
      id: 3,
      name: "PainRelief-X",
      batchId: "BAT-9012-EF",
      rfid: "RFID-456789123",
      origin: "Powai, Mumbai",
      destination: "Chembur, Mumbai",
      status: "pending",
      blockchainStatus: "pending",
      blockchainHash: "N/A",
      aiFraudStatus: "pending",
      aiConfidence: "N/A",
      timestamp: "N/A",
      coords: { origin: [72.9053, 19.1161], destination: [72.8998, 19.0522] },
      isPublic: true,
      price: "₹299.99"
    }
  ]);
  const [orderHistory] = useState([
    { id: 1, name: "FluGuard", batchId: "BAT-1111-GH", date: "2025-03-10", status: "delivered" },
    { id: 2, name: "ImmuneBoost", batchId: "BAT-2222-IJ", date: "2025-03-05", status: "delivered" }
  ]);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [72.8777, 19.0760], // Default Mumbai center
        zoom: 11,
        pitch: 45,
        bearing: 20
      });
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        if (map.current.getLayer('building')) {
          map.current.setLayoutProperty('building', 'visibility', 'visible');
          map.current.setPaintProperty('building', 'fill-extrusion-height', [
            'interpolate', ['linear'], ['zoom'], 15, 0, 16, ['get', 'height']
          ]);
          map.current.setPaintProperty('building', 'fill-extrusion-base', [
            'interpolate', ['linear'], ['zoom'], 15, 0, 16, ['get', 'min_height']
          ]);
          map.current.setPaintProperty('building', 'fill-extrusion-color', [
            'interpolate', ['linear'], ['get', 'height'], 0, '#E0F7FA', 50, '#B2EBF2', 100, '#80DEEA'
          ]);
        }
        drawRoute({ coords: { origin: [72.8479, 19.1136], destination: [72.9080, 19.0864] } });
      });
    }
  }, []);

  useEffect(() => {
    if (selectedMedicine && map.current && map.current.isStyleLoaded()) {
      drawRoute(selectedMedicine);
    }
  }, [selectedMedicine]);

  const fetchRoute = async (origin, destination) => {
    setIsLoading(true);
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        const route = data.routes[0].geometry.coordinates;
        const distance = data.routes[0].distance / 1000; // in km
        setRouteData({ coordinates: route, distance });
        calculateCarbonFootprint(distance);
        return route;
      }
      return [origin, destination];
    } catch (error) {
      console.error('Error fetching route:', error);
      return [origin, destination];
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCarbonFootprint = (distance) => {
    const footprint = (distance * 0.2).toFixed(2); // 0.2 kg CO2 per km
    setCarbonFootprint({
      value: footprint,
      status: footprint < 5 ? 'low' : footprint < 10 ? 'moderate' : 'high'
    });
  };

  const drawRoute = async (medicine) => {
    const { origin, destination } = medicine.coords;
    const routeCoordinates = await fetchRoute(origin, destination);

    if (map.current.getSource('route')) {
      map.current.getSource('route').setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: routeCoordinates }
      });
    } else {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: routeCoordinates }
        }
      });
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#4CAF50', 'line-width': 4, 'line-opacity': 0.8 }
      });
    }

    map.current._markers.forEach(marker => marker.remove());
    new mapboxgl.Marker({ color: '#2196F3' }).setLngLat(origin).addTo(map.current);
    new mapboxgl.Marker({ color: '#4CAF50' }).setLngLat(destination).addTo(map.current);

    map.current.fitBounds([origin, destination], { padding: 50 });
  };

  const handleMedicineClick = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleBuyNow = (medicine) => {
    console.log(`Buying ${medicine.name} for ${medicine.price}`);
  };

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', feedbackText);
    setFeedbackText('');
    setShowFeedback(false);
  };

  const handleCommunicationSubmit = () => {
    console.log('Message to pharmacist:', communicationMessage);
    setCommunicationMessage('');
    setShowCommunication(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-blue-950 text-white">
        {/* Sidebar content */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Header content */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {/* Existing content */}
          <div className="flex flex-col lg:flex-row flex-1 gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 flex flex-col gap-6">
              {/* Medicine Listing */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-lg animate-fade-in">
                <h3 className="text-blue-600 font-semibold mb-4 text-xl flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Medicines
                </h3>
                {medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className={`bg-gray-100 p-4 rounded-lg border border-blue-100 mb-4 hover:bg-blue-50 transition-all cursor-pointer relative ${
                      selectedMedicine?.id === medicine.id ? 'ring-2 ring-blue-300' : ''
                    } ${medicine.isPublic ? 'glow-effect' : ''}`}
                    onClick={() => handleMedicineClick(medicine)}
                  >
                    <h4 className="text-blue-700 font-medium text-lg">{medicine.name}</h4>
                    <p className="text-sm text-gray-600">Batch: {medicine.batchId}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            medicine.status === 'in-transit'
                              ? 'bg-blue-100 text-blue-600'
                              : medicine.status === 'delivered'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {medicine.status.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            medicine.blockchainStatus === 'verified'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          BC: {medicine.blockchainStatus.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            medicine.aiFraudStatus === 'clean'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          AI: {medicine.aiFraudStatus.toUpperCase()}
                        </span>
                      </div>
                      {medicine.isPublic && (
                        <span className="absolute top-2 right-2 bg-green-400 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                          PUBLIC
                        </span>
                      )}
                    </div>
                    {medicine.isPublic && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(medicine);
                        }}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold shadow-md transform hover:scale-105 transition-all"
                      >
                        Buy Now - {medicine.price}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Order History */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-lg animate-fade-in">
                <button
                  className="w-full text-left text-blue-600 font-semibold mb-2 text-lg flex items-center"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  Order History {showHistory ? '▲' : '▼'}
                </button>
                {showHistory && (
                  <div className="space-y-3">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="bg-gray-100 p-3 rounded-md text-sm">
                        <p className="text-gray-700">{order.name}</p>
                        <p className="text-xs text-gray-500">Batch: {order.batchId}</p>
                        <p className="text-xs text-gray-500">Date: {order.date}</p>
                        <p
                          className={`text-xs ${
                            order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Feedback Form */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-lg animate-fade-in">
                <button
                  className="w-full text-left text-blue-600 font-semibold mb-2 text-lg flex items-center"
                  onClick={() => setShowFeedback(!showFeedback)}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12h.01M12 12h.01M9 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submit Feedback {showFeedback ? '▲' : '▼'}
                </button>
                {showFeedback && (
                  <div className="space-y-3">
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Your feedback on the medicine..."
                      className="w-full p-2 bg-gray-100 text-gray-800 rounded border border-blue-200 text-sm"
                      rows="3"
                    />
                    <button
                      onClick={handleFeedbackSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold shadow-md transform hover:scale-105 transition-all"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>

              {/* Communication with Pharmacist */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-lg animate-fade-in">
                <button
                  className="w-full text-left text-blue-600 font-semibold mb-2 text-lg flex items-center"
                  onClick={() => setShowCommunication(!showCommunication)}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Pharmacist {showCommunication ? '▲' : '▼'}
                </button>
                {showCommunication && (
                  <div className="space-y-3">
                    <textarea
                      value={communicationMessage}
                      onChange={(e) => setCommunicationMessage(e.target.value)}
                      placeholder="Ask about dosage, side effects, etc..."
                      className="w-full p-2 bg-gray-100 text-gray-800 rounded border border-blue-200 text-sm"
                      rows="3"
                    />
                    <button
                      onClick={handleCommunicationSubmit}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold shadow-md transform hover:scale-105 transition-all"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>

              {/* Carbon Footprint */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-lg animate-fade-in">
                <h3 className="text-blue-600 font-semibold mb-2 text-lg flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Carbon Footprint
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">Estimated CO₂: {carbonFootprint?.value || 'N/A'} kg</p>
                  <p
                    className={`text-sm ${
                      carbonFootprint?.status === 'low'
                        ? 'text-green-600'
                        : carbonFootprint?.status === 'moderate'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    Status: {carbonFootprint?.status || 'N/A'}
                  </p>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        carbonFootprint?.status === 'low'
                          ? 'bg-green-500'
                          : carbonFootprint?.status === 'moderate'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${carbonFootprint ? Math.min(carbonFootprint.value * 10, 100) : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Map and Details */}
            <div className="w-full lg:w-3/4 bg-white rounded-lg overflow-hidden border border-blue-200 shadow-2xl relative">
              <div ref={mapContainer} className="w-full h-[80vh]" />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center z-10">
                  <div className="text-blue-600 flex items-center flex-col">
                    <svg
                      className="animate-spin h-12 w-12 mb-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-lg">Fetching Route...</span>
                  </div>
                </div>
              )}

              {/* Medicine Details Popup */}
              {selectedMedicine && (
                <div className="absolute top-4 right-4 bg-white rounded-lg p-3 border border-blue-200 shadow-2xl w-72">
                  <h3 className="text-blue-700 font-semibold mb-2 text-xl">{selectedMedicine.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch ID</span>
                      <span className="text-blue-600">{selectedMedicine.batchId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RFID</span>
                      <span className="text-blue-600">{selectedMedicine.rfid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">From</span>
                      <span className="text-blue-600">{selectedMedicine.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To</span>
                      <span className="text-blue-600">{selectedMedicine.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blockchain Hash</span>
                      <span className="text-blue-600 truncate">{selectedMedicine.blockchainHash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Confidence</span>
                      <span className="text-blue-600">{selectedMedicine.aiConfidence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp</span>
                      <span className="text-blue-600">{selectedMedicine.timestamp}</span>
                    </div>
                    {routeData && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance</span>
                        <span className="text-blue-600">{routeData.distance.toFixed(1)} km</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Live Chat Toggle */}
              <div className="absolute bottom-6 right-6">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </button>
                {showChat && (
                  <div className="absolute bottom-16 right-0 bg-white rounded-lg p-4 border border-blue-200 shadow-2xl w-64">
                    <h3 className="text-blue-600 font-semibold mb-2 text-lg">Pharmacy Support</h3>
                    <p className="text-sm text-gray-600">Chat with us!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Pharmaceutical Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes glow-effect {
          0% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
          50% { box-shadow: 0 0 15px rgba(76, 175, 80, 0.8); }
          100% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .glow-effect {
          animation: glow-effect 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default PharmaDashboard;