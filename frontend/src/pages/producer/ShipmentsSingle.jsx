
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token would need to be replaced with your actual token
mapboxgl.accessToken = "pk.eyJ1IjoiYmhhbnVoYXJzIiwiYSI6ImNtOGI0ZHR2dTFxdmcya3NmMXR1ZnhrYnYifQ.tudlNhBcrIlyw6Ez8onolQ";

const RouteMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('route1');
  
  // Mumbai location coordinates
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
    powai: [72.9053, 19.1161]
  };
  
  // Predefined routes
  const routes = {
    route1: {
      name: "Andheri to Ghatkopar",
      origin: locations.andheri,
      destination: locations.ghatkopar,
      warehouseId: "WH-MUM-001",
      productId: "PRD-3452-XY",
      distance: "15.2 km",
      estimatedTime: "45 min",
      status: "Verified",
      via: [locations.kurla]
    },
    route2: {
      name: "Bandra to Chembur",
      origin: locations.bandra,
      destination: locations.chembur,
      warehouseId: "WH-MUM-002",
      productId: "PRD-7890-AB",
      distance: "17.8 km",
      estimatedTime: "55 min",
      status: "Pending",
      via: [locations.dadar, locations.kurla]
    },
    route3: {
      name: "Borivali to Mulund",
      origin: locations.borivali,
      destination: locations.mulund,
      warehouseId: "WH-MUM-003",
      productId: "PRD-1234-CD",
      distance: "22.5 km",
      estimatedTime: "65 min",
      status: "Verified",
      via: [locations.powai]
    },
    route4: {
      name: "Dadar to Thane",
      origin: locations.dadar,
      destination: locations.thane,
      warehouseId: "WH-MUM-004",
      productId: "PRD-5678-EF",
      distance: "25.3 km",
      estimatedTime: "70 min",
      status: "Blocked",
      via: [locations.kurla, locations.powai]
    }
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [72.8777, 19.0760], // Mumbai center
      zoom: 11
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add scale
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    
    // Wait for map to load
    map.current.on('load', () => {
      drawRoute(selectedRoute);
    });
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;
    drawRoute(selectedRoute);
  }, [selectedRoute]);

  // Function to get optimal route using Mapbox Directions API
  const getOptimalRoute = async (start, waypoints, end) => {
    setIsLoading(true);
    
    try {
      // Prepare waypoints for the API
      const waypointsString = waypoints.map(wp => `${wp[0]},${wp[1]}`).join(';');
      
      // Build the API URL
      // Format: /directions/v5/{profile}/{coordinates}
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${waypointsString};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Check if route was found
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates;
      } else {
        console.error('No route found', data);
        // Fallback to direct line if no route found
        return [start, ...waypoints, end];
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback to direct line if API fails
      return [start, ...waypoints, end];
    } finally {
      setIsLoading(false);
    }
  };

  const drawRoute = async (routeId) => {
    const mapInstance = map.current;
    if (!mapInstance || !mapInstance.loaded()) return;
    
    setIsLoading(true);
    
    // Clear previous layers and sources
    if (mapInstance.getLayer('route-line')) mapInstance.removeLayer('route-line');
    if (mapInstance.getLayer('route-points')) mapInstance.removeLayer('route-points');
    if (mapInstance.getSource('route')) mapInstance.removeSource('route');
    if (mapInstance.getSource('points')) mapInstance.removeSource('points');
    
    // Remove previous markers
    const markers = document.querySelectorAll('.marker');
    markers.forEach(marker => marker.remove());
    
    const route = routes[routeId];
    if (!route) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Get optimal route from Mapbox Directions API
      const routeCoordinates = await getOptimalRoute(route.origin, route.via, route.destination);
      
      // Create points for markers (only origin, via points, and destination)
      const pointCoordinates = [route.origin, ...route.via, route.destination];
      
      // Fit map to the route bounds
      const bounds = new mapboxgl.LngLatBounds();
      routeCoordinates.forEach(coord => bounds.extend(coord));
      mapInstance.fitBounds(bounds, { padding: 80, animate: true });
      
      // Add route source with the detailed path from Directions API
      mapInstance.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates
          }
        }
      });
      
      // Add route layer
      mapInstance.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': route.status === 'Blocked' ? '#ef4444' : 
                         route.status === 'Pending' ? '#f59e0b' : '#3b82f6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
      
      // Add points source for the key locations (not every point in the detailed path)
      mapInstance.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pointCoordinates.map((coord, index) => ({
            type: 'Feature',
            properties: {
              description: index === 0 ? 'Origin' : 
                           index === pointCoordinates.length - 1 ? 'Destination' : 
                           `Checkpoint ${index}`,
              type: index === 0 ? 'origin' : 
                    index === pointCoordinates.length - 1 ? 'destination' : 'checkpoint'
            },
            geometry: {
              type: 'Point',
              coordinates: coord
            }
          }))
        }
      });
      
      // Add points layer
      mapInstance.addLayer({
        id: 'route-points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'type'],
            'origin', '#10b981',
            'destination', '#ef4444',
            '#3b82f6'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#1e293b'
        }
      });
      
      // Add popups for points
      mapInstance.on('click', 'route-points', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
        
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<div class="font-semibold">${description}</div>`)
          .addTo(mapInstance);
      });
      
      // Change cursor on hover
      mapInstance.on('mouseenter', 'route-points', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });
      
      mapInstance.on('mouseleave', 'route-points', () => {
        mapInstance.getCanvas().style.cursor = '';
      });
      
      // Add markers with custom HTML for key locations
      pointCoordinates.forEach((coord, index) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border-2 ${
          index === 0 ? 'border-green-500' : 
          index === pointCoordinates.length - 1 ? 'border-red-500' : 
          'border-blue-500'
        }">${index + 1}</div>`;
        
        new mapboxgl.Marker(el)
          .setLngLat(coord)
          .addTo(mapInstance);
      });
      
    } catch (error) {
      console.error('Error drawing route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteChange = (e) => {
    setSelectedRoute(e.target.value);
  };

  // Function to calculate dynamic route for a new location
  const calculateDynamicRoute = async (start, end, via = []) => {
    setIsLoading(true);
    try {
      const routeCoordinates = await getOptimalRoute(
        [parseFloat(start[0]), parseFloat(start[1])],
        via.map(coord => [parseFloat(coord[0]), parseFloat(coord[1])]),
        [parseFloat(end[0]), parseFloat(end[1])]
      );
      
      return routeCoordinates;
    } catch (error) {
      console.error('Error calculating dynamic route:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-slate-800 p-4 text-white">
        <h1 className="text-2xl font-bold">BlockTrace Route Optimization</h1>
        <p className="text-gray-400">Find the shortest path between Mumbai locations</p>
      </div>
      
      <div className="flex flex-col md:flex-row flex-1 gap-4 p-4 bg-slate-900">
        <div className="w-full md:w-1/4 bg-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Select Route</h2>
          <select 
            value={selectedRoute} 
            onChange={handleRouteChange}
            className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 mb-4"
          >
            <option value="route1">Andheri to Ghatkopar</option>
            <option value="route2">Bandra to Chembur</option>
            <option value="route3">Borivali to Mulund</option>
            <option value="route4">Dadar to Thane</option>
          </select>
          
          <div className="bg-slate-700 p-4 rounded-lg mb-4">
            <h3 className="text-white font-semibold text-lg mb-2">Route Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Product ID:</span>
                <span className="text-white">{routes[selectedRoute].productId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Warehouse ID:</span>
                <span className="text-white">{routes[selectedRoute].warehouseId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance:</span>
                <span className="text-white">{routes[selectedRoute].distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Time:</span>
                <span className="text-white">{routes[selectedRoute].estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${
                  routes[selectedRoute].status === 'Verified' ? 'text-green-500' : 
                  routes[selectedRoute].status === 'Pending' ? 'text-yellow-500' : 
                  'text-red-500'
                }`}>
                  {routes[selectedRoute].status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 p-4 rounded-lg mb-4">
            <h3 className="text-white font-semibold text-lg mb-2">Blockchain Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-white truncate">0x8f72c9...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Block Number:</span>
                <span className="text-white">12,453,678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-white">Mar 18, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Confirmations:</span>
                <span className="text-white">24</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700 p-4 rounded-lg mb-4">
            <h3 className="text-white font-semibold text-lg mb-2">AI Fraud Detection</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Risk Score:</span>
                <span className={`text-${selectedRoute === 'route4' ? 'red' : 'green'}-500 font-medium`}>
                  {selectedRoute === 'route4' ? '85%' : '2%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Authenticity:</span>
                <span className={`text-${selectedRoute === 'route4' ? 'red' : 'green'}-500 font-medium`}>
                  {selectedRoute === 'route4' ? 'Failed' : 'Verified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Compliance:</span>
                <span className={`text-${selectedRoute === 'route4' ? 'red' : selectedRoute === 'route2' ? 'yellow' : 'green'}-500 font-medium`}>
                  {selectedRoute === 'route4' ? 'Failed' : selectedRoute === 'route2' ? 'Pending' : 'Passed'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300">
              View Details
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300">
              Approve
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-3/4 bg-slate-800 rounded-lg overflow-hidden flex flex-col relative">
          <div ref={mapContainer} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center">
              <div className="text-blue-500 flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="mt-2">Calculating optimal route...</span>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 bg-slate-800 p-3 rounded-lg shadow-lg">
            <div className="flex items-center text-xs space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-white">Origin</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-white">Checkpoint</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-white">Destination</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-slate-800 p-3 rounded-lg shadow-lg">
            <div className="flex items-center text-xs space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-green-500 rounded-full bg-slate-800 mr-1"></div>
                <span className="text-white">Verified</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-yellow-500 rounded-full bg-slate-800 mr-1"></div>
                <span className="text-white">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-red-500 rounded-full bg-slate-800 mr-1"></div>
                <span className="text-white">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 p-3 text-gray-400 text-xs">
        <div className="flex justify-between">
          <span>BlockTrace © 2025 | Blockchain-Powered Supply Chain with AI Fraud Detection</span>
          <span>Last updated: Mar 18, 2025 | 14:35:22</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;

