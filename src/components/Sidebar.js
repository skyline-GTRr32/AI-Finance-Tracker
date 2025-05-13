import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaChartPie, FaLightbulb, FaCog, FaChartLine, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const menuItems = [
    { path: '/', icon: <FaHome />, name: 'Dashboard' },
    { path: '/transactions', icon: <FaExchangeAlt />, name: 'Transactions' },
    { path: '/budget', icon: <FaChartPie />, name: 'Budget' },
    { path: '/insights', icon: <FaLightbulb />, name: 'AI Insights' },
    { path: '/settings', icon: <FaCog />, name: 'Settings' }
  ];

  return (
    <aside 
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out h-screen sticky top-0 ${
        collapsed ? 'w-16' : 'w-64'
      } ${isMobile ? 'absolute z-40' : 'relative'}`}
    >
      <div className={`h-full flex flex-col ${collapsed ? 'items-center' : ''}`}>
        {/* Toggle button */}
        <button 
          className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md hover:shadow-lg focus:outline-none z-50"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars className="text-primary-500" size={14} />
        </button>
        
        {/* Logo area (small screen) */}
        <div className={`flex items-center justify-center mt-6 mb-6 ${!collapsed ? 'hidden' : 'block'}`}>
          <div className="bg-primary-100 text-primary-600 p-3 rounded-xl">
            <FaChartLine size={20} />
          </div>
        </div>
        
        {/* Navigation links */}
        <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-6'} py-4`}>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${collapsed ? 'justify-center' : ''} p-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-primary-100 text-primary-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <span className={`flex items-center justify-center text-lg ${location.pathname === item.path ? 'text-primary-600' : ''}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom section */}
        {!collapsed && (
          <div className="p-4 mt-auto mb-6 mx-6 bg-primary-50 rounded-xl">
            <div className="text-sm font-medium text-primary-700 mb-2">AI Integration</div>
            <p className="text-xs text-gray-600">Configure your OpenRouter API key in settings to unlock AI features.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;