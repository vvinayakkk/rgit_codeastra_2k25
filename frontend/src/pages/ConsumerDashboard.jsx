import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Header from '../components/header';

mapboxgl.accessToken = "pk.eyJ1IjoiYmhhbnVoYXJzIiwiYSI6ImNtOGI0ZHR2dTFxdmcya3NmMXR1ZnhrYnYifQ.tudlNhBcrIlyw6Ez8onolQ";

const PharmaDashboard = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
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
        center: [72.8777, 19.0760],
        zoom: 11,
        pitch: 45,
        bearing: 20
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        if (map.current.getLayer('building')) {
          map.current.setLayoutProperty('building', 'visibility', 'visible');
          map.current.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                15.05, ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                15, 0,
                15.05, ['get', 'min_height']
              ],
              'fill-extrusion-opacity': .6
            }
          });
        }
      });
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    if (selectedMedicine && map.current && map.current.isStyleLoaded()) {
      drawRoute(selectedMedicine);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedMedicine]);

  const fetchRoute = async (origin, destination) => {
    setIsLoading(true);
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        const route = data.routes[0].geometry.coordinates;
        const distance = data.routes[0].distance / 1000;
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
    const footprint = (distance * 0.2).toFixed(2);
    setCarbonFootprint({
      value: footprint,
      status: footprint < 5 ? 'low' : footprint < 10 ? 'moderate' : 'high'
    });
  };

  const drawRoute = async (medicine) => {
    const { origin, destination } = medicine.coords;
    const routeCoordinates = await fetchRoute(origin, destination);

    if (map.current && map.current.isStyleLoaded()) {
      let i = 0;
      const animateRoute = () => {
        if (i <= routeCoordinates.length) {
          const partialRoute = routeCoordinates.slice(0, i);
          if (map.current.getSource('route')) {
            map.current.getSource('route').setData({
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: partialRoute }
            });
          } else {
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: { type: 'LineString', coordinates: partialRoute }
              }
            });
            map.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: { 
                'line-color': '#4CAF50', 
                'line-width': 4, 
                'line-opacity': 0.8 
              }
            });
          }
          i++;
          requestAnimationFrame(animateRoute);
        }
      };
      animateRoute();
    }
  };

  const handleMedicineClick = async (medicine) => {
    try {
      setSelectedMedicine(medicine);
      setIsLoading(true);
      
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      if (map.current && map.current.isStyleLoaded()) {
        const originMarker = new mapboxgl.Marker({ color: '#2196F3' })
          .setLngLat(medicine.coords.origin)
          .setPopup(new mapboxgl.Popup()
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-blue-700">Origin: ${medicine.origin}</h3>
                <p class="text-sm">Status: ${medicine.status}</p>
                <p class="text-sm">Time: ${medicine.timestamp}</p>
              </div>
            `))
          .addTo(map.current);

        const destinationMarker = new mapboxgl.Marker({ color: '#4CAF50' })
          .setLngLat(medicine.coords.destination)
          .setPopup(new mapboxgl.Popup()
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-green-700">Destination: ${medicine.destination}</h3>
                <p class="text-sm">Batch: ${medicine.batchId}</p>
                ${medicine.price ? `<p class="text-sm">Price: ${medicine.price}</p>` : ''}
              </div>
            `))
          .addTo(map.current);

        markers.current.push(originMarker, destinationMarker);
        originMarker.togglePopup();

        const bounds = new mapboxgl.LngLatBounds()
          .extend(medicine.coords.origin)
          .extend(medicine.coords.destination);

        map.current.easeTo({
          bounds: bounds,
          padding: { top: 100, bottom: 100, left: 100, right: 400 },
          duration: 1500,
          easing: (t) => t * (2 - t)
        });

        await drawRoute(medicine);
      }
    } catch (error) {
      console.error('Error handling medicine click:', error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row flex-1 gap-6">
            <div className="w-full lg:w-1/4 flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-blue-600 font-semibold mb-4 text-xl flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        <span className={`px-2 py-1 rounded text-xs ${
                          medicine.status === 'in-transit' ? 'bg-blue-100 text-blue-600' :
                          medicine.status === 'delivered' ? 'bg-green-100 text-green-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {medicine.status.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          medicine.blockchainStatus === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          BC: {medicine.blockchainStatus.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          medicine.aiFraudStatus === 'clean' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
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

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900 shadow-xl backdrop-blur-sm bg-opacity-90">
                <button
                  className="w-full text-left text-blue-600 font-semibold mb-2 text-lg flex items-center"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
                        <p className={`text-xs ${order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.status.toUpperCase()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900 shadow-xl backdrop-blur-sm bg-opacity-90">
                <button
                  className="w-full text-left text-blue-600 font-semibold mb-2 text-lg flex items-center"
                  onClick={() => setShowFeedback(!showFeedback)}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h.01M12 12h.01M9 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900 shadow-xl backdrop-blur-sm bg-opacity-90">
                <button
                  className="w-full text-left text-blue-600 font-semibold mb-2 text-lg flex items-center"
                  onClick={() => setShowCommunication(!showCommunication)}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900 shadow-xl backdrop-blur-sm bg-opacity-90">
                <h3 className="text-blue-600 font-semibold mb-2 text-lg flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Carbon Footprint
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">Estimated CO₂: {carbonFootprint?.value || 'N/A'} kg</p>
                  <p className={`text-sm ${
                    carbonFootprint?.status === 'low' ? 'text-green-600' :
                    carbonFootprint?.status === 'moderate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    Status: {carbonFootprint?.status || 'N/A'}
                  </p>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        carbonFootprint?.status === 'low' ? 'bg-green-500' :
                        carbonFootprint?.status === 'moderate' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${carbonFootprint ? Math.min(carbonFootprint.value * 10, 100) : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900 shadow-2xl relative">
              <div ref={mapContainer} className="w-full h-[80vh]" />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center z-10">
                  <div className="text-blue-600 flex items-center flex-col">
                    <svg className="animate-spin h-12 w-12 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-lg">Fetching Route...</span>
                  </div>
                </div>
              )}

              {selectedMedicine && (
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900 shadow-2xl backdrop-blur-sm bg-opacity-95 w-80 transform transition-all duration-300 hover:scale-105">
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

              <div className="absolute bottom-6 right-6">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(0.98); }
          }
          @keyframes glow-effect {
            0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
            100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          }
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .animate-fade-in {
            animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .glow-effect {
            animation: glow-effect 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          html {
            scroll-behavior: smooth;
          }
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
};

export default PharmaDashboard;