
import React from 'react';
import './App.css';

function App() {
  const features = [
    {
      id: 1,
      title: 'My Profile',
      icon: '👤',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'My Interviews',
      icon: '🎯',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Book SME',
      icon: '📚',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'Job Tracker',
      icon: '🏆',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-purple-600">iQua.ai</span>
                <span className="text-xs text-gray-500 -mt-1">AI that gets you</span>
              </div>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium text-sm">Sweety Patel</span>
              <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">📄</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Main illustration container */}
              <div className="w-96 h-80 bg-gradient-to-br from-blue-100 via-purple-50 to-orange-50 rounded-full relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-16 left-16 w-20 h-20 bg-blue-200 rounded-lg transform rotate-12 opacity-60"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-orange-200 rounded-lg transform -rotate-12 opacity-60"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 rounded-lg transform rotate-45 opacity-60"></div>
                
                {/* People illustrations (simplified) */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-20 bg-teal-400 rounded-t-full relative">
                    <div className="w-8 h-8 bg-orange-300 rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-16 left-8">
                  <div className="w-14 h-18 bg-blue-600 rounded-t-full relative">
                    <div className="w-7 h-7 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-16 right-8">
                  <div className="w-14 h-18 bg-orange-500 rounded-t-full relative">
                    <div className="w-7 h-7 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                
                {/* Puzzle pieces */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex space-x-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-lg"></div>
                    <div className="w-12 h-12 bg-orange-400 rounded-lg shadow-lg"></div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <div className="w-12 h-12 bg-orange-400 rounded-lg shadow-lg"></div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-lg"></div>
                  </div>
                </div>
                
                {/* Decorative plants */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-8 h-12 bg-green-400 rounded-t-full opacity-70"></div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="w-6 h-10 bg-green-400 rounded-t-full opacity-70"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`${feature.bgColor} p-6 rounded-3xl border border-white/50 shadow-card hover:shadow-lg-soft transition-all duration-300 cursor-pointer group hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center text-2xl shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className={`font-semibold text-lg ${feature.textColor}`}>
                    {feature.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
