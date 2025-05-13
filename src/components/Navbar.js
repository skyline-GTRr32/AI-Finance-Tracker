import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCoins, FaPlus, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddTransaction = () => {
    // Navigate to transactions page and trigger add transaction modal
    navigate('/transactions');
    // We'll use a URL parameter to trigger the add transaction modal
    window.openAddTransactionModal = true;
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 text-xl font-bold">
          <FaCoins className="text-yellow-300" />
          <span className="hidden sm:block">AI Finance Tracker</span>
          <span className="block sm:hidden">AI Finance</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-4 py-2 flex items-center transition-all shadow-md hover:shadow-lg"
            onClick={handleAddTransaction}
          >
            <FaPlus className="mr-2" size={12} /> Add Transaction
          </button>
          <div className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all cursor-pointer">
            <span className="text-lg font-semibold">A</span>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute top-16 right-4 left-4 bg-white text-gray-800 rounded-lg shadow-xl p-4 md:hidden z-50 transition-all transform origin-top">
            <div className="flex flex-col space-y-3">
              <button 
                className="bg-primary-500 text-white hover:bg-primary-600 rounded-lg px-4 py-2 flex items-center justify-center transition-all"
                onClick={handleAddTransaction}
              >
                <FaPlus className="mr-2" size={12} /> Add Transaction
              </button>
              <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all">
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                  <span className="font-medium">A</span>
                </div>
                <span>Account</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;