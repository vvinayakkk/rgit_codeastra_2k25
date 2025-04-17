import React, { useState } from 'react';
import { BsGearFill } from 'react-icons/bs';

function Camera() {
    const [modelView, setModelView] = useState(false);

    return (
        <div className="bg-blue-900  shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-navy-700 dark:text-white">Live Camera Feed</h2>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setModelView(!modelView)}
                        className={`px-4 py-1 rounded-md text-sm ${
                        modelView ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-navy-700'
                        }`}
                    >
                        AI Model View
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-navy-700">
                        <BsGearFill size={18} className="text-navy-700 dark:text-white" />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  (
                    <video
                      className="w-full h-full object-cover"
                      src="https://egdbvwtvwqhqorfknmfj.supabase.co/storage/v1/object/public/uploads//processed_intruder_16f75649-81e0-4238-9611-749c559de60a.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Camera 1 - Front Door
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  <video
                    className="w-full h-full object-cover"
                    src="https://egdbvwtvwqhqorfknmfj.supabase.co/storage/v1/object/public/uploads//processed_back2_40b08d6f-6b51-4f56-995b-fe92ecf2202e%20(1).mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Camera 2 - Backyard
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  <video
                    className="w-full h-full object-cover"
                    src="https://egdbvwtvwqhqorfknmfj.supabase.co/storage/v1/object/public/uploads//processed_garage_e1c54b23-70bf-4bb4-b87d-8a9301bee382.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Camera 3 - Garage
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  <video
                    className="w-full h-full object-cover"
                    src="https://egdbvwtvwqhqorfknmfj.supabase.co/storage/v1/object/public/uploads//processed_side_bc2ee1f4-e6b6-43fe-8607-bee46ae7cd19.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Camera 4 - Driveway
                  </div>
                </div>
              </div>
            </div>
    )
}

export default Camera;