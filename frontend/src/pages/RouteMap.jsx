import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import io from 'socket.io-client';

mapboxgl.accessToken = "pk.eyJ1IjoiYmhhbnVoYXJzIiwiYSI6ImNtOGI0ZHR2dTFxdmcya3NmMXR1ZnhrYnYifQ.tudlNhBcrIlyw6Ez8onolQ";

const WalletDetails = ({ blockchainData }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Wallet Analysis</h2>
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="space-y-4">
          <div className="flex items-center">
            <div dangerouslySetInnerHTML={{ __html: blockchainData.walletIcon }} />
            <h3 className="ml-2 text-xl text-blue-300">{blockchainData.walletType}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Address</p>
              <p className="text-sm font-mono break-all">{blockchainData.walletAddress}</p>
            </div>
            <div>
              <p className="text-gray-400">Balance</p>
              <p className="text-green-300">{blockchainData.walletBalance}</p>
            </div>
            <div>
              <p className="text-gray-400">Gas/Fee</p>
              <p className="text-yellow-300">{blockchainData.walletGas}</p>
            </div>
            <div>
              <p className="text-gray-400">Transparency</p>
              <p className={blockchainData.transparency === 'valid' ? 'text-green-300' : 'text-red-300'}>
                {blockchainData.transparency}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-blue-300 mb-2">Blockchain Validation Process</h4>
            <ul className="space-y-2 text-sm">
              <li>✓ Transaction Signature Verification</li>
              <li>✓ Block Hash Validation</li>
              <li>✓ Merkle Tree Consistency Check</li>
              <li>✓ Timestamp Verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIDetails = ({ aiValidation }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">AI Analysis Details</h2>
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl text-blue-300 mb-2">{aiValidation.modelName}</h3>
            <p className="text-gray-400">Version: {aiValidation.modelVersion}</p>
            <p className="text-gray-400">Processing Time: {aiValidation.processingTime}</p>
          </div>
          <div>
            <h4 className="text-blue-300 mb-2">Validation Results</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Authenticity</p>
                <p className={aiValidation.authenticity === 'verified' ? 'text-green-300' : 'text-red-300'}>
                  {aiValidation.authenticity}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Condition</p>
                <p className={aiValidation.condition === 'good' ? 'text-green-300' : 'text-red-300'}>
                  {aiValidation.condition}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Confidence Score</p>
                <p className="text-blue-300">{aiValidation.confidence}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-blue-300 mb-2">AI Validation Process</h4>
            <ul className="space-y-2 text-sm">
              {aiValidation.validationSteps.map((step, index) => (
                <li key={index}>✓ {step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-blue-300 mb-2">Advanced Analysis</h4>
            <div className="space-y-2 text-sm">
              <p>✓ Anomaly Detection: Pattern recognition with 95% accuracy</p>
              <p>✓ Federated Learning: Cross-validated with 100+ nodes</p>
              <p>✓ Feature Analysis: 256-dimension vector space</p>
              <p>✓ Confidence Threshold: 0.85 minimum score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlockchainSection = ({ blockchainData, navigate }) => {
  return (
    <div
      className="space-y-3 cursor-pointer hover:bg-slate-750 transition-colors p-2 rounded-md"
      onClick={() => blockchainData && navigate('/wallet-details', { state: { blockchainData } })}
    >
      <h3 className="text-white font-semibold mb-2 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        Blockchain Validation
      </h3>
      <input
        type="text"
        value={blockchainData.rfid || ''}
        readOnly
        className="w-full p-3 bg-slate-700 text-white rounded border border-slate-600 font-mono text-sm"
      />
      {blockchainData?.walletIcon && (
        <div className="p-3 bg-slate-700 rounded-md border border-slate-600">
          <div className="flex items-center mb-2">
            <div className="mr-2" dangerouslySetInnerHTML={{ __html: blockchainData.walletIcon }} />
            <span className="font-medium text-blue-300">{blockchainData.walletType}</span>
          </div>
          <div className="text-xs text-gray-400 truncate mb-1">{blockchainData.walletAddress}</div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-300">Balance:</span>
            <span className="text-sm text-green-300">{blockchainData.walletBalance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">Gas:</span>
            <span className="text-sm text-yellow-300">{blockchainData.walletGas}</span>
          </div>
        </div>
      )}
      {blockchainData?.packageStats && (
        <div className="p-3 bg-slate-700 rounded-md border border-slate-600">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Package Statistics</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs">
              <div className="text-gray-400">Temperature</div>
              <div className="text-white">{blockchainData.packageStats.temperature}</div>
            </div>
            <div className="text-xs">
              <div className="text-gray-400">Integrity</div>
              <div className="text-white">{blockchainData.packageStats.integrity}</div>
            </div>
            <div className="text-xs">
              <div className="text-gray-400">Last Scan</div>
              <div className="text-white">{blockchainData.packageStats.timeSinceLastScan}</div>
            </div>
            <div className="text-xs">
              <div className="text-gray-400">ETA</div>
              <div className="text-white">{blockchainData.packageStats.estimatedArrival}</div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`p-3 rounded-md text-center font-medium animate-fade-in ${
          blockchainData.transparency === 'valid' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}
      >
        {blockchainData.transparency === 'valid' ? 'Transparency Validated ✓' : 'Tampering Detected!'}
      </div>
      <div className="text-xs text-gray-400 mt-2">Click for detailed blockchain analysis</div>
    </div>
  );
};

const AISection = ({ aiValidation, navigate }) => {
  return (
    <div
      className="space-y-3 mt-4 cursor-pointer hover:bg-slate-750 transition-colors p-2 rounded-md"
      onClick={() => aiValidation && navigate('/aianalysis', { state: { aiValidation } })}
    >
      <h3 className="text-white font-semibold mb-2 flex items-center">
        <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        AI Validation
      </h3>
      {aiValidation && (
        <>
          <div className="p-3 bg-slate-700 rounded-md border border-slate-600">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-blue-300">{aiValidation.modelName}</span>
            </div>
            <div className="text-xs text-gray-400">Version: {aiValidation.modelVersion}</div>
            <div className="text-xs text-gray-400">Processing time: {aiValidation.processingTime}</div>
            <div className="mt-3 space-y-1">
              {aiValidation.validationSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-xs text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full h-24">
            <div className="absolute inset-0 flex items-center justify-center animate-spin-3d">
              <div className="w-16 h-16 bg-blue-500 rounded-full opacity-50"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Authenticity</span>
              <span className={`text-sm ${aiValidation.authenticity === 'verified' ? 'text-green-300' : 'text-red-300'}`}>
                {aiValidation.authenticity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Condition</span>
              <span className={`text-sm ${aiValidation.condition === 'good' ? 'text-green-300' : 'text-red-300'}`}>
                {aiValidation.condition}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Confidence</span>
              <span className="text-blue-300">{aiValidation.confidence}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Click for detailed AI analysis</div>
        </>
      )}
    </div>
  );
};

const RouteMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const animationRef = useRef(null);
  const markersRef = useRef([]);
  const sensorsRef = useRef([]);
  const userMarkerRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const socket = useRef(io('http://localhost:6003'));

  const [role, setRole] = useState('producer');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [rfidInput, setRfidInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [activeSensors, setActiveSensors] = useState([]);
  const [sensorReadings, setSensorReadings] = useState({
    temperature: { value: 24, status: 'normal' },
    humidity: { value: 65, status: 'normal' },
    shock: { value: 0.2, status: 'normal' },
    battery: { value: 92, status: 'normal' }
  });
  const [notification, setNotification] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [aiValidation, setAiValidation] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const [customOrigin, setCustomOrigin] = useState('');
  const [customCoords, setCustomCoords] = useState(null);

  const locations = {
    andheri: [72.8479, 19.1136],
    ghatkopar: [72.9080, 19.0864],
    bandra: [72.8296, 19.0596],
    dadar: [72.8410, 19.0183],
    kurla: [72.8880, 19.0726],
    chembur: [72.8998, 19.0522],
    borivali: [72.8562, 19.2317],
    thane: [72.9726, 19.2183],
    mulund: [72.9492, 19.1724],
    powai: [72.9053, 19.1161],
    vikhroli: [72.9330, 19.1096],
    santacruz: [72.8416, 19.0803],
    sion: [72.8630, 19.0429],
    wadala: [72.8726, 19.0180],
    goregaon: [72.8691, 19.1663],
    kandivali: [72.8526, 19.2033]
  };

  const geocodeLocation = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setCustomCoords([lng, lat]);
        return [lng, lat];
      } else {
        setNotification({
          type: 'error',
          message: 'Location not found!',
          time: new Date().toLocaleTimeString()
        });
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setNotification({
        type: 'error',
        message: 'Error geocoding location!',
        time: new Date().toLocaleTimeString()
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = params.get('src');
    const dest = params.get('dest');
    const userRole = params.get('role') || 'producer';
    setRole(userRole);

    const generateRoute = (originCoords, destKey) => {
      const routeId = customCoords ? `custom-to-${destKey}` : `${src}-to-${destKey}`;
      const findIntermediatePoints = (start, end) => {
        const potentialHops = Object.entries(locations).filter(([name]) => name !== src && name !== destKey);
        const distanceBetween = (p1, p2) => Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
        const directDistance = distanceBetween(start, end) * 1.3;
        const viableHops = potentialHops
          .filter(([_, coords]) => {
            const totalDistance = distanceBetween(start, coords) + distanceBetween(coords, end);
            return totalDistance <= directDistance;
          })
          .map(([name, coords]) => ({ name, coords }));
        viableHops.sort((a, b) => {
          const aDist = distanceBetween(start, a.coords) + distanceBetween(a.coords, end);
          const bDist = distanceBetween(start, b.coords) + distanceBetween(b.coords, end);
          return aDist - bDist;
        });
        return viableHops.slice(0, 2);
      };

      const intermediatePoints = findIntermediatePoints(originCoords, locations[destKey]);
      const newRoute = {
        name: customCoords ? `Custom to ${destKey.charAt(0).toUpperCase() + destKey.slice(1)}` : `${src.charAt(0).toUpperCase() + src.slice(1)} to ${destKey.charAt(0).toUpperCase() + destKey.slice(1)}`,
        origin: originCoords,
        destination: locations[destKey],
        warehouseId: `WH-MUM-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: `PRD-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        rfid: `RFID-${Math.floor(10000000 + Math.random() * 90000000)}`,
        distance: `${(distanceBetween(originCoords, locations[destKey]) * 100).toFixed(1)} km`,
        estimatedTime: `${Math.floor(30 + Math.random() * 40)} min`,
        via: intermediatePoints.map(point => point.coords),
        viaNames: intermediatePoints.map(point => point.name)
      };
      function distanceBetween(p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
      }
      setRouteData({ [routeId]: newRoute });
      setSelectedRoute(routeId);
      socket.current.emit('joinRoom', routeId);
    };

    if (customCoords && dest && locations[dest]) {
      generateRoute(customCoords, dest);
    } else if (src && dest && locations[src] && locations[dest]) {
      generateRoute(locations[src], dest);
    } else {
      const defaultRoutes = {
        'andheri-to-ghatkopar': {
          name: "Andheri to Ghatkopar",
          origin: locations.andheri,
          destination: locations.ghatkopar,
          warehouseId: "WH-MUM-1234",
          productId: "PRD-3452-XY",
          rfid: "RFID-123456788",
          distance: "15.2 km",
          estimatedTime: "45 min",
          via: [locations.powai, locations.vikhroli],
          viaNames: ['powai', 'vikhroli']
        }
      };
      setRouteData(defaultRoutes);
      setSelectedRoute('andheri-to-ghatkopar');
      socket.current.emit('joinRoom', 'andheri-to-ghatkopar');
    }
  }, [customCoords]);

  useEffect(() => {
    if (map.current) return;
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
        map.current.setPaintProperty('building', 'fill-extrusion-height', [
          'interpolate', ['linear'], ['zoom'], 15, 0, 16, ['get', 'height']
        ]);
        map.current.setPaintProperty('building', 'fill-extrusion-base', [
          'interpolate', ['linear'], ['zoom'], 15, 0, 16, ['get', 'min_height']
        ]);
        map.current.setPaintProperty('building', 'fill-extrusion-color', [
          'interpolate', ['linear'], ['get', 'height'], 0, '#111111', 50, '#222222', 100, '#333333'
        ]);
      }
      if (selectedRoute && routeData) drawRoute(selectedRoute);
    });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      socket.current.disconnect();
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (selectedRoute) socket.current.emit('joinRoom', selectedRoute);
    });

    socket.current.on('joined', (data) => {
      console.log(`Joined room ${data.room} as ${role}`);
    });

    socket.current.on('deliveryStarted', (data) => {
      if (data.routeId === selectedRoute) {
        setDeliveryStatus('in-transit');
        drawRoute(selectedRoute, data.coordinates);
      }
    });

    socket.current.on('locationUpdate', (data) => {
      if (data.routeId === selectedRoute) {
        updateVehiclePosition(data.coordinate, data.position);
      }
    });

    socket.current.on('rfidVerified', (data) => {
      if (data.routeId === selectedRoute) {
        setVerificationResult(data.status);
        setNotification({
          type: data.status === 'verified' ? 'success' : 'error',
          message: data.status === 'verified' ? `${role === 'producer' ? 'Retailer Verified RFID!' : 'Product Verified!'}` : 
                   data.status === 'fraud-detected' ? 'Fraud Detected!' : 'Verification Failed!',
          time: new Date().toLocaleTimeString()
        });
      }
    });

    return () => {
      socket.current.off('deliveryStarted');
      socket.current.off('locationUpdate');
      socket.current.off('rfidVerified');
    };
  }, [role, selectedRoute]);

  useEffect(() => {
    if (map.current && map.current.loaded() && selectedRoute && routeData) {
      drawRoute(selectedRoute);
    }
  }, [selectedRoute, routeData]);

  useEffect(() => {
    if (deliveryStatus !== 'in-transit') return;
    const updateInterval = setInterval(() => {
      setSensorReadings(prev => {
        const tempChange = (Math.random() - 0.5) * 2;
        const humidityChange = (Math.random() - 0.5) * 5;
        const shockChange = Math.random() < 0.1 ? Math.random() * 2 : 0;
        const batteryChange = -0.05;
        const newTemp = Math.max(15, Math.min(35, prev.temperature.value + tempChange));
        const newHumidity = Math.max(30, Math.min(90, prev.humidity.value + humidityChange));
        const newShock = Math.max(0, Math.min(10, prev.shock.value + shockChange));
        const newBattery = Math.max(0, Math.min(100, prev.battery.value + batteryChange));
        if (newTemp > 30 || newHumidity > 85 || newShock > 5) {
          setNotification({
            type: 'warning',
            message: newTemp > 30 ? 'High temperature detected!' : newHumidity > 85 ? 'High humidity detected!' : 'Impact detected!',
            time: new Date().toLocaleTimeString()
          });
        }
        return {
          temperature: { value: parseFloat(newTemp.toFixed(1)), status: newTemp > 30 ? 'warning' : 'normal' },
          humidity: { value: parseFloat(newHumidity.toFixed(1)), status: newHumidity > 85 ? 'warning' : 'normal' },
          shock: { value: parseFloat(newShock.toFixed(1)), status: newShock > 5 ? 'warning' : newShock > 2 ? 'caution' : 'normal' },
          battery: { value: parseFloat(newBattery.toFixed(1)), status: newBattery < 20 ? 'warning' : newBattery < 50 ? 'caution' : 'normal' }
        };
      });
    }, 3000);
    return () => clearInterval(updateInterval);
  }, [deliveryStatus]);

  const getOptimalRoute = async (start, waypoints, end) => {
    setIsLoading(true);
    try {
      const waypointsString = waypoints.map(wp => `${wp[0]},${wp[1]}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${waypointsString ? waypointsString + ';' : ''}${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes[0]) {
        return data.routes[0].geometry.coordinates;
      }
      return [start, ...waypoints, end];
    } catch (error) {
      console.error('Error fetching route:', error);
      return [start, ...waypoints, end];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockchainData = async (rfid) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          walletIcon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          walletType: 'Ethereum',
          walletAddress: '0x' + Math.random().toString(16).substr(2, 40),
          walletBalance: `${(Math.random() * 10).toFixed(2)} ETH`,
          walletGas: `${(Math.random() * 0.1).toFixed(4)} ETH`,
          rfid,
          transparency: Math.random() < 0.9 ? 'valid' : 'tampered',
          packageStats: {
            temperature: `${(Math.random() * 10 + 20).toFixed(1)}°C`,
            integrity: Math.random() < 0.95 ? 'Intact' : 'Compromised',
            timeSinceLastScan: `${Math.floor(Math.random() * 60)} min ago`,
            estimatedArrival: `${Math.floor(Math.random() * 24)} hours`
          }
        });
      }, 1000);
    });
  };

  const validateWithAI = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          modelName: 'DeepTrace v3',
          modelVersion: '3.1.2',
          processingTime: `${(Math.random() * 2 + 1).toFixed(2)}s`,
          authenticity: Math.random() < 0.95 ? 'verified' : 'suspect',
          condition: Math.random() < 0.9 ? 'good' : 'damaged',
          confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
          validationSteps: [
            'Image Recognition Completed',
            'Pattern Matching Verified',
            'Anomaly Detection Passed',
            'Confidence Score Calculated'
          ]
        });
      }, 1500);
    });
  };

  const simulateDelivery = async () => {
    if (role !== 'producer') return;
    setDeliveryStatus('in-transit');
    const route = routeData[selectedRoute];
    const allPoints = [route.origin, ...route.via, route.destination];
    const routeCoordinates = await getOptimalRoute(route.origin, route.via, route.destination);

    socket.current.emit('startDelivery', { routeId: selectedRoute, coordinates: routeCoordinates });

    const el = document.createElement('div');
    el.className = 'vehicle-marker';
    el.innerHTML = `
      <div class="flex items-center justify-center relative">
        <div class="relative w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full border-4 border-yellow-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </div>
      </div>
    `;
    vehicleMarkerRef.current = new mapboxgl.Marker(el).setLngLat(routeCoordinates[0]).addTo(map.current);
    deploySensors(allPoints);

    let step = 0;
    const maxSteps = 3000;
    const hopPoints = [0, ...route.via.map((_, idx) => Math.floor(((idx + 1) / (allPoints.length - 1)) * maxSteps)), maxSteps];
    const pauseDuration = 3000;

    const animateMovement = async () => {
      if (step > maxSteps) {
        setCurrentPosition(allPoints.length - 1);
        setDeliveryStatus('delivered');
        vehicleMarkerRef.current.setLngLat(route.destination);
        const finalBlockchain = await fetchBlockchainData(route.rfid);
        setBlockchainData(finalBlockchain);
        const finalAI = await validateWithAI(finalBlockchain);
        setAiValidation(finalAI);
        setNotification({
          type: 'success',
          message: 'Delivery Complete - Awaiting Verification!',
          time: new Date().toLocaleTimeString()
        });
        generateFinalReport(route, finalBlockchain, finalAI);
        flyToEyeLevel(route.destination);
        return;
      }

      const progress = step / maxSteps;
      const totalRoutePoints = routeCoordinates.length;
      const currentRouteIndex = Math.floor(progress * (totalRoutePoints - 1));
      const nextRouteIndex = Math.min(currentRouteIndex + 1, totalRoutePoints - 1);
      const segmentProgress = (progress * (totalRoutePoints - 1)) % 1;

      const startPoint = routeCoordinates[currentRouteIndex];
      const endPoint = routeCoordinates[nextRouteIndex];
      const newLng = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress;
      const newLat = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress;
      const coordinate = [newLng, newLat];
      vehicleMarkerRef.current.setLngLat(coordinate);

      socket.current.emit('locationUpdate', { routeId: selectedRoute, coordinate, position: Math.floor(progress * (allPoints.length - 1)) });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat(coordinate);
        map.current.setCenter(coordinate);
      }

      const currentHopIndex = hopPoints.findIndex(hopStep => step === hopStep);
      if (currentHopIndex !== -1 && currentHopIndex < hopPoints.length) {
        el.className = 'vehicle-marker animate-hop';
        const blockchain = await fetchBlockchainData(route.rfid);
        setBlockchainData(blockchain);
        const aiResult = await validateWithAI(blockchain);
        setAiValidation(aiResult);

        let pauseCount = 0;
        const pauseInterval = setInterval(() => {
          pauseCount += 16;
          if (pauseCount >= pauseDuration) {
            clearInterval(pauseInterval);
            el.className = 'vehicle-marker';
            setBlockchainData(null);
            setAiValidation(null);
            step++;
            animationRef.current = requestAnimationFrame(animateMovement);
          }
        }, 16);
        return;
      }

      updateSensors(step, maxSteps);
      const hopProgress = hopPoints.findIndex(hop => step <= hop);
      setCurrentPosition(Math.max(0, hopProgress - 1));
      step++;
      animationRef.current = requestAnimationFrame(animateMovement);
    };

    animationRef.current = requestAnimationFrame(animateMovement);
  };

  const updateVehiclePosition = (coordinate, position) => {
    if (!vehicleMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.innerHTML = `
        <div class="flex items-center justify-center relative">
          <div class="relative w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full border-4 border-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
        </div>
      `;
      vehicleMarkerRef.current = new mapboxgl.Marker(el).setLngLat(coordinate).addTo(map.current);
    } else {
      vehicleMarkerRef.current.setLngLat(coordinate);
    }

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(coordinate);
      map.current.setCenter(coordinate);
    }

    setCurrentPosition(position);
    const route = routeData[selectedRoute];
    const distance = Math.sqrt(
      Math.pow(coordinate[0] - route.destination[0], 2) +
      Math.pow(coordinate[1] - route.destination[1], 2)
    );
    if (distance < 0.001 && role !== 'producer') {
      setDeliveryStatus('delivered');
      flyToEyeLevel(coordinate);
    }
  };

  const generateFinalReport = (route, blockchain, ai) => {
    setFinalReport({
      routeName: route.name,
      productId: route.productId,
      rfid: route.rfid,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      blockchainHash: blockchain.ipfsHash || 'N/A',
      transparency: blockchain.transparency,
      aiAuthenticity: ai.authenticity,
      aiCondition: ai.condition,
      aiConfidence: ai.confidence,
      timestamp: new Date().toISOString()
    });
  };

  const flyToEyeLevel = (lngLat) => {
    map.current.flyTo({
      center: lngLat,
      zoom: 17,
      pitch: 60,
      bearing: 0,
      duration: 2000,
      essential: true
    });

    if (userMarkerRef.current) userMarkerRef.current.remove();
    const userEl = document.createElement('div');
    userEl.className = 'user-marker';
    userEl.innerHTML = `
      <div class="relative">
        <div class="absolute w-10 h-10 bg-blue-400 rounded-full opacity-50 animate-pulse" style="bottom: 0; left: 50%; transform: translateX(-50%);"></div>
        <div class="realistic-person">
          <div class="person-head"></div>
          <div class="person-body">
            <div class="person-arm person-left-arm"></div>
            <div class="person-arm person-right-arm"></div>
            <div class="person-leg person-left-leg"></div>
            <div class="person-leg person-right-leg"></div>
          </div>
        </div>
      </div>
    `;
    userMarkerRef.current = new mapboxgl.Marker(userEl).setLngLat(lngLat).addTo(map.current);
  };

  const deploySensors = (routePoints) => {
    sensorsRef.current.forEach(marker => marker.remove());
    sensorsRef.current = [];
    const sensors = [];
    routePoints.forEach((point, idx) => {
      if (idx > 0 && idx < routePoints.length - 1) {
        const offset = 0.005;
        const sensorPoints = [
          [point[0], point[1]],
          [point[0] + offset * (Math.random() - 0.5), point[1] + offset * (Math.random() - 0.5)],
          [point[0] + offset * (Math.random() - 0.5), point[1] + offset * (Math.random() - 0.5)]
        ];
        sensorPoints.forEach((sensorPoint, i) => {
          const sensorType = ['RFID', 'IR', 'Temperature'][i % 3];
          sensors.push({
            position: sensorPoint,
            type: sensorType,
            id: `sensor-${idx}-${i}`,
            status: 'idle'
          });
        });
      }
    });
    sensors.forEach(sensor => {
      const el = document.createElement('div');
      el.className = 'sensor-marker';
      el.innerHTML = `
        <div class="sensor-${sensor.type.toLowerCase()} opacity-70 w-6 h-6 rounded-full bg-gray-800 border border-gray-500 flex items-center justify-center text-xs text-gray-300">
          ${sensor.type.charAt(0)}
        </div>
      `;
      const marker = new mapboxgl.Marker(el).setLngLat(sensor.position).addTo(map.current);
      sensorsRef.current.push(marker);
    });
    setActiveSensors(sensors);
  };

  const updateSensors = (step, maxSteps) => {
    const progress = step / maxSteps;
    setActiveSensors(prev => {
      return prev.map((sensor, idx) => {
        const shouldActivate = Math.random() < 0.1 || (idx / prev.length < progress + 0.1 && idx / prev.length > progress - 0.2);
        if (shouldActivate && sensor.status === 'idle') {
          sensorsRef.current[idx].getElement().innerHTML = `
            <div class="sensor-${sensor.type.toLowerCase()} w-6 h-6 rounded-full bg-green-700 border border-green-500 flex items-center justify-center text-xs text-white animate-pulse">
              ${sensor.type.charAt(0)}
            </div>
          `;
          if (Math.random() < 0.3) {
            setNotification({
              type: 'info',
              message: `${sensor.type} sensor detected package`,
              time: new Date().toLocaleTimeString()
            });
          }
          return { ...sensor, status: 'active' };
        } else if (!shouldActivate && sensor.status === 'active') {
          sensorsRef.current[idx].getElement().innerHTML = `
            <div class="sensor-${sensor.type.toLowerCase()} opacity-70 w-6 h-6 rounded-full bg-gray-800 border border-gray-500 flex items-center justify-center text-xs text-gray-300">
              ${sensor.type.charAt(0)}
            </div>
          `;
          return { ...sensor, status: 'idle' };
        }
        return sensor;
      });
    });
  };

  const verifyRFID = () => {
    if (role === 'producer') return;
    setIsLoading(true);
    const route = routeData[selectedRoute];
    socket.current.emit('verifyRFID', { routeId: selectedRoute, rfid: rfidInput, expectedRFID: route.rfid });
    setTimeout(() => setIsLoading(false), 1500);
  };

  const drawRoute = async (routeId, coordinates = null) => {
    const mapInstance = map.current;
    if (!mapInstance || !mapInstance.loaded() || !routeData || !routeData[routeId]) return;

    setIsLoading(true);
    ['route-line', 'route-glow', 'route-arrow', 'route-points'].forEach(layer => {
      if (mapInstance.getLayer(layer)) mapInstance.removeLayer(layer);
    });
    ['route', 'route-glow', 'route-arrow', 'points'].forEach(source => {
      if (mapInstance.getSource(source)) mapInstance.removeSource(source);
    });
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const route = routeData[routeId];
    const routeCoordinates = coordinates || await getOptimalRoute(route.origin, route.via, route.destination);
    const pointCoordinates = [route.origin, ...route.via, route.destination];
    const pointLabels = ['Origin', ...route.viaNames.map((name, i) => `Hop ${i + 1}: ${name}`), 'Destination'];

    const bounds = new mapboxgl.LngLatBounds();
    routeCoordinates.forEach(coord => bounds.extend(coord));
    mapInstance.fitBounds(bounds, { padding: 80, duration: 1000 });

    mapInstance.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: routeCoordinates }
      }
    });
    mapInstance.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#4d7bef', 'line-width': 8, 'line-opacity': 0.5, 'line-blur': 3 }
    });
    mapInstance.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#3b82f6', 'line-width': 4, 'line-opacity': 0.8 }
    });

    pointCoordinates.forEach((coord, index) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      const isCompleted = index <= currentPosition;
      const isOrigin = index === 0;
      const isDestination = index === pointCoordinates.length - 1;
      let markerHTML = '';
      if (isOrigin) {
        markerHTML = `
          <div class="relative">
            <div class="absolute w-14 h-14 bg-blue-500 rounded-full opacity-30 ${isCompleted ? 'animate-ping' : ''}" style="top: -7px; left: -7px;"></div>
            <div class="w-12 h-12 flex items-center justify-center rounded-full ${isCompleted ? 'bg-green-600' : 'bg-blue-600'} border-2 border-white text-white shadow-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div class="mt-2 px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded shadow whitespace-nowrap">${pointLabels[index]}</div>
          </div>
        `;
      } else if (isDestination) {
        markerHTML = `
          <div class="relative">
            <div class="absolute w-14 h-14 bg-blue-500 rounded-full opacity-30 ${isCompleted ? 'animate-ping' : ''}" style="top: -7px; left: -7px;"></div>
            <div class="w-12 h-12 flex items-center justify-center rounded-full ${isCompleted ? 'bg-green-600' : 'bg-red-600'} border-2 border-white text-white shadow-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="mt-2 px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded shadow whitespace-nowrap">${pointLabels[index]}</div>
          </div>
        `;
      } else {
        markerHTML = `
          <div class="relative">
            <div class="absolute w-10 h-10 bg-blue-500 rounded-full opacity-30 ${isCompleted ? 'animate-ping' : ''}" style="top: -5px; left: -5px;"></div>
            <div class="w-8 h-8 flex items-center justify-center rounded-full ${isCompleted ? 'bg-green-600' : 'bg-yellow-600'} border-2 border-white text-white shadow-lg cursor-pointer">${index}</div>
            <div class="mt-2 px-2 py-1 bg-gray-800 text-gray-200 text-xs rounded shadow whitespace-nowrap">${pointLabels[index]}</div>
          </div>
        `;
      }
      el.innerHTML = markerHTML;

      const marker = new mapboxgl.Marker(el).setLngLat(coord).addTo(mapInstance);
      el.addEventListener('click', () => flyToEyeLevel(coord));
      markersRef.current.push(marker);
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = crazyStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const handleCustomLocationSubmit = async () => {
    if (!customOrigin) return;
    const coords = await geocodeLocation(customOrigin);
    if (coords) {
      setCustomCoords(coords);
      const params = new URLSearchParams(window.location.search);
      const dest = params.get('dest') || 'ghatkopar';
      setSelectedRoute(`custom-to-${dest}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="bg-slate-800 border-b border-blue-900 p-4 relative overflow-hidden">
        <div className="relative flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <span className="text-blue-400">Block</span><span className="text-white">Trace</span>
            </h1>
            <p className="text-blue-300 text-sm">Next-Gen Supply Chain with Blockchain & AI</p>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-xs text-green-400">LIVE TRACKING</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4 bg-slate-900">
        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg">
            <h3 className="text-white font-semibold mb-2">Role & Route Selection</h3>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setDeliveryStatus('pending');
                setCurrentPosition(0);
                setRfidInput('');
                setVerificationResult(null);
                if (selectedRoute) socket.current.emit('joinRoom', selectedRoute);
              }}
              className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 mb-2"
            >
              <option value="producer">Producer</option>
              <option value="retailer">Retailer</option>
            </select>
            <div className="mb-2">
              <input
                type="text"
                value={customOrigin}
                onChange={(e) => setCustomOrigin(e.target.value)}
                placeholder="Enter your location (e.g., Mumbai)"
                className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600"
              />
              <button
                onClick={handleCustomLocationSubmit}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Geocoding...' : 'Set Custom Origin'}
              </button>
            </div>
            {routeData && (
              <select
                value={selectedRoute}
                onChange={(e) => {
                  setSelectedRoute(e.target.value);
                  setDeliveryStatus('pending');
                  setCurrentPosition(0);
                  setRfidInput('');
                  setVerificationResult(null);
                  socket.current.emit('joinRoom', e.target.value);
                }}
                className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600"
              >
                {Object.entries(routeData).map(([id, route]) => (
                  <option key={id} value={id}>{route.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg">
            <h3 className="text-white font-semibold mb-2">Package Details</h3>
            {routeData && selectedRoute && routeData[selectedRoute] && (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span className="text-gray-400 text-sm">Product ID</span>
                  <span className="text-blue-300 font-mono">{routeData[selectedRoute].productId}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span className="text-gray-400 text-sm">RFID</span>
                  <span className="text-blue-300 font-mono">{role === 'producer' ? routeData[selectedRoute].rfid : 'Hidden'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span className="text-gray-400 text-sm">Distance</span>
                  <span className="text-blue-300">{routeData[selectedRoute].distance}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span className="text-gray-400 text-sm">Est. Time</span>
                  <span className="text-blue-300">{routeData[selectedRoute].estimatedTime}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${deliveryStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' : deliveryStatus === 'in-transit' ? 'bg-blue-900 text-blue-300 animate-pulse' : 'bg-green-900 text-green-300'}`}>
                    {deliveryStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg">
            {role === 'producer' && deliveryStatus === 'pending' && (
              <button onClick={simulateDelivery} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Start Delivery'}
              </button>
            )}
            {role === 'retailer' && deliveryStatus === 'delivered' && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold mb-2">Verify Product</h3>
                <input
                  type="text"
                  value={rfidInput}
                  onChange={(e) => setRfidInput(e.target.value)}
                  placeholder="Enter RFID to verify"
                  className="w-full p-3 bg-slate-700 text-white rounded border border-slate-600 font-mono"
                />
                <button onClick={verifyRFID} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify on Blockchain'}
                </button>
                {verificationResult && (
                  <div className={`mt-2 p-3 rounded-md text-center font-medium ${verificationResult === 'verified' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {verificationResult === 'verified' ? 'Product Authenticated ✓' : 'Verification Failed!'}
                  </div>
                )}
              </div>
            )}
            {deliveryStatus === 'in-transit' && blockchainData && (
              <BlockchainSection blockchainData={blockchainData} navigate={navigate} />
            )}
            {deliveryStatus === 'in-transit' && aiValidation && (
              <AISection aiValidation={aiValidation} navigate={navigate} />
            )}
            {deliveryStatus === 'delivered' && finalReport && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold mb-2">Final Delivery Report</h3>
                <div className="p-2 bg-slate-700 rounded">
                  <p><span className="text-gray-400">Route:</span> {finalReport.routeName}</p>
                  <p><span className="text-gray-400">Product ID:</span> {finalReport.productId}</p>
                  <p><span className="text-gray-400">RFID:</span> {finalReport.rfid}</p>
                  <p><span className="text-gray-400">Distance:</span> {finalReport.distance}</p>
                  <p><span className="text-gray-400">Time:</span> {finalReport.estimatedTime}</p>
                  <p><span className="text-gray-400">Transparency:</span> <span className={finalReport.transparency === 'valid' ? 'text-green-300' : 'text-red-300'}>{finalReport.transparency}</span></p>
                  <p><span className="text-gray-400">AI Authenticity:</span> <span className={finalReport.aiAuthenticity === 'verified' ? 'text-green-300' : 'text-red-300'}>{finalReport.aiAuthenticity}</span></p>
                  <p><span className="text-gray-400">AI Condition:</span> <span className={finalReport.aiCondition === 'good' ? 'text-green-300' : 'text-red-300'}>{finalReport.aiCondition}</span></p>
                  <p><span className="text-gray-400">AI Confidence:</span> {finalReport.aiConfidence}</p>
                  <p><span className="text-gray-400">Timestamp:</span> {finalReport.timestamp}</p>
                </div>
                <div className="space-x-2 mt-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-2 rounded-md font-medium" onClick={() => navigate('/aianalysis', { state: { aiValidation } })}>
                    AI Analysis
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-2 rounded-md font-medium" onClick={() => navigate('/blockchainanalysis', { state: { blockchainData } })}>
                    Blockchain Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
          {deliveryStatus === 'in-transit' && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg">
              <h3 className="text-white font-semibold mb-3">Live Sensor Readings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Temperature</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${sensorReadings.temperature.status === 'warning' ? 'text-red-400' : 'text-blue-300'}`}>{sensorReadings.temperature.value}°C</span>
                    <div className={`ml-2 h-2 w-2 rounded-full ${sensorReadings.temperature.status === 'warning' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Humidity</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${sensorReadings.humidity.status === 'warning' ? 'text-red-400' : 'text-blue-300'}`}>{sensorReadings.humidity.value}%</span>
                    <div className={`ml-2 h-2 w-2 rounded-full ${sensorReadings.humidity.status === 'warning' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Shock</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${sensorReadings.shock.status === 'warning' ? 'text-red-400' : sensorReadings.shock.status === 'caution' ? 'text-yellow-400' : 'text-blue-300'}`}>{sensorReadings.shock.value} G</span>
                    <div className={`ml-2 h-2 w-2 rounded-full ${sensorReadings.shock.status === 'warning' ? 'bg-red-500 animate-pulse' : sensorReadings.shock.status === 'caution' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Battery</span>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${sensorReadings.battery.status === 'warning' ? 'text-red-400' : sensorReadings.battery.status === 'caution' ? 'text-yellow-400' : 'text-blue-300'}`}>{sensorReadings.battery.value}%</span>
                    <div className={`ml-2 h-2 w-2 rounded-full ${sensorReadings.battery.status === 'warning' ? 'bg-red-500 animate-pulse' : sensorReadings.battery.status === 'caution' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full lg:w-3/4 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-xl relative">
          <div ref={mapContainer} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-10">
              <div className="text-blue-400 flex items-center flex-col">
                <svg className="animate-spin h-10 w-10 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
          {notification && (
            <div className={`absolute top-4 right-4 p-3 rounded-lg shadow-lg border max-w-xs animate-fade-in ${notification.type === 'success' ? 'bg-green-900 border-green-700 text-green-300' : notification.type === 'error' ? 'bg-red-900 border-red-700 text-red-300' : notification.type === 'warning' ? 'bg-yellow-900 border-yellow-700 text-yellow-300' : 'bg-blue-900 border-blue-700 text-blue-300'}`}>
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs opacity-80 mt-1">{notification.time}</p>
            </div>
          )}
          {deliveryStatus === 'in-transit' && routeData && selectedRoute && (
            <div className="absolute bottom-6 left-6 right-6 bg-slate-800 bg-opacity-90 rounded-lg p-3 border border-slate-700 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Delivery Progress</span>
                <span className="text-sm text-blue-300 font-medium">{Math.round((currentPosition / (routeData[selectedRoute].via.length + 1)) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(currentPosition / (routeData[selectedRoute].via.length + 1)) * 100}%` }}></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Origin</span>
                <span>Destination</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-3d {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          50% { transform: rotateX(180deg) rotateY(180deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        .animate-spin-3d { animation: spin-3d 3s infinite linear; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        ${crazyStyles}
      `}</style>
    </div>
  );
};

const crazyStyles = `
  @keyframes ping-slow { 0% { transform: scale(0.5); opacity: 0.8; } 80% { transform: scale(2.5); opacity: 0; } 100% { transform: scale(2.5); opacity: 0; } }
  @keyframes pulse-crazy { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.3) rotate(10deg); opacity: 0.8; } 100% { transform: scale(1); opacity: 0.5; } }
  @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes hop-crazy { 0% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-20px) rotate(15deg); } 50% { transform: translateY(0) rotate(0deg); } 75% { transform: translateY(-15px) rotate(-15deg); } 100% { transform: translateY(0) rotate(0deg); } }
  @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-30px); } 60% { transform: translateY(-15px); } }
  @keyframes walking-animation { 0% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } 100% { transform: rotate(-5deg); } }
  
  .animate-ping-slow { animation: ping-slow 3s infinite; }
  .animate-pulse-crazy { animation: pulse-crazy 1.5s infinite; }
  .animate-spin-slow { animation: spin-slow 5s linear infinite; }
  .animate-hop-crazy { animation: hop-crazy 0.8s infinite; }
  .animate-bounce { animation: bounce 2s infinite; }
  
  .realistic-person {
    position: relative;
    width: 24px;
    height: 36px;
    transform: translateX(-50%);
  }
  
  .person-head {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background-color: #3b82f6;
    border-radius: 50%;
    border: 1px solid #2563eb;
  }
  
  .person-body {
    position: absolute;
    top: 9px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 14px;
    background-color: #3b82f6;
    border-radius: 3px;
    border: 1px solid #2563eb;
  }
  
  .person-arm {
    position: absolute;
    width: 6px;
    height: 2px;
    background-color: #3b82f6;
    border: 1px solid #2563eb;
    animation: walking-animation 1s infinite;
  }
  
  .person-left-arm {
    top: 4px;
    left: -5px;
    transform-origin: right center;
  }
  
  .person-right-arm {
    top: 4px;
    right: -5px;
    transform-origin: left center;
  }
  
  .person-leg {
    position: absolute;
    width: 2px;
    height: 10px;
    background-color: #3b82f6;
    border: 1px solid #2563eb;
    animation: walking-animation 1s infinite;
  }
  
  .person-left-leg {
    bottom: -10px;
    left: 1px;
    transform-origin: top center;
    animation-delay: 0.5s;
  }
  
  .person-right-leg {
    bottom: -10px;
    right: 1px;
    transform-origin: top center;
  }
`;

export default RouteMap;