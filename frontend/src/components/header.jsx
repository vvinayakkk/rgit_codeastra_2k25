import { Search , Bell , ChevronDown } from "lucide-react";
import { useState } from "react";

function Header(){
    const [notifications, setNotifications] = useState(0);
    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      };

    return (
        <header className="bg-gray-800 p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-medium">{getCurrentDate()}</h2>
                    <p className="text-sm text-gray-400">Welcome back, Producer Inc.</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-gray-700 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute right-3 top-2 text-gray-400" size={16} />
                    </div>
                    
                    <div className="relative mr-6">
                      <button className="relative">
                        <Bell className="text-gray-400 hover:text-white" size={20} />
                        {notifications > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                            {notifications}
                          </span>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                        <span className="font-bold">PI</span>
                      </div>
                      <span>Admin</span>
                      <ChevronDown size={14} className="ml-1" />
                    </div>
                  </div>
                </header>
    )
}
export default Header