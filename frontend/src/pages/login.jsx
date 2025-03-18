
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User, Users } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
        email,
        password,
        userType
    }
    localStorage.setItem("user", user);
    if(userType === "energyProducer"){
        navigate('/producer');
    }else if(userType === "retailer"){
        navigate('/retailer');
    }else if(userType === "consumer"){
        navigate('/consumer');
    }else{

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-500/20">
        <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Welcome</h2>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { type: "energyProducer", icon: Building2, label: "Producer" },
            { type: "retailer", icon: User, label: "Retailer" },
            { type: "consumer", icon: Users, label: "Consumer" }
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                userType === type 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-300">Email address</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-blue-300">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;