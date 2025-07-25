
import React from 'react';
import './App.css';

function App() {
  const features = [
    {
      id: 1,
      title: 'My Profile',
      icon: '👤',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      title: 'My Interviews',
      icon: '👥',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      id: 3,
      title: 'Book SME',
      icon: '📊',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    },
    {
      id: 4,
      title: 'Job Tracker',
      icon: '🏆',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📄</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">Resume Enhancer</span>
              <span className="text-xs text-gray-500 -mt-1">AI-powered resume builder</span>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium text-sm">John Smith</span>
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">📄</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Illustration */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Main circular background */}
                <div className="w-96 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full relative overflow-hidden flex items-center justify-center">
                  {/* People figures */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-16 bg-orange-400 rounded-t-full relative">
                      <div className="w-6 h-6 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-16 left-12">
                    <div className="w-10 h-14 bg-blue-600 rounded-t-full relative">
                      <div className="w-5 h-5 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-16 right-12">
                    <div className="w-10 h-14 bg-orange-500 rounded-t-full relative">
                      <div className="w-5 h-5 bg-orange-300 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Puzzle pieces in center */}
                  <div className="flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-md"></div>
                      <div className="w-12 h-12 bg-orange-400 rounded-lg shadow-md"></div>
                      <div className="w-12 h-12 bg-orange-400 rounded-lg shadow-md"></div>
                      <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-md"></div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute bottom-4 left-8">
                    <div className="w-6 h-8 bg-green-400 rounded-t-full"></div>
                  </div>
                  <div className="absolute bottom-4 right-8">
                    <div className="w-4 h-6 bg-green-400 rounded-t-full"></div>
                  </div>
                  
                  {/* Background shapes */}
                  <div className="absolute top-16 left-16 w-16 h-16 bg-blue-200 rounded-lg transform rotate-12 opacity-60"></div>
                  <div className="absolute top-20 right-20 w-12 h-12 bg-orange-200 rounded-lg transform -rotate-12 opacity-60"></div>
                  <div className="absolute bottom-20 left-20 w-8 h-8 bg-purple-200 rounded-lg transform rotate-45 opacity-60"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Navigation Cards */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`${feature.bgColor} ${feature.borderColor} border-2 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-medium text-lg text-blue-600">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
