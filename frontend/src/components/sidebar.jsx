import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Package, Truck, BarChart2, Settings, LogOut } from "lucide-react";


function Sidebar() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const navigate = useNavigate();

  const handleChange = (tab) => {
    setSelectedTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="w-64 bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">BlockTrace</h1>
        <p className="text-sm text-gray-400">Producer Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul>
          {[
            { name: "producer", icon: Layers },
            { name: "Products", icon: Package },
            { name: "Analytics", icon: BarChart2 },
            { name: "Settings", icon: Settings },
          ].map(({ name, icon: Icon }) => (
            <li key={name} className={`mb-2 rounded ${selectedTab === name ? "bg-blue-900" : ""}`}>
              <button
                onClick={() => handleChange(name)}
                className="flex items-center p-3 w-full text-left"
              >
                <Icon className="mr-3 text-blue-400" size={18} />
                <span className="capitalize">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center text-gray-400 hover:text-white">
          <LogOut className="mr-2" size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
