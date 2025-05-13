import React, { useState, useEffect } from 'react';
import TransactionList from '../components/TransactionList';
import AddTransaction from '../components/AddTransaction';
import { FaPlus } from 'react-icons/fa';

const Transactions = () => {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  useEffect(() => {
    // Check if add transaction modal should be opened from navbar
    if (window.openAddTransactionModal) {
      setIsAddTransactionOpen(true);
      window.openAddTransactionModal = false;
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-1" /> Add Transaction
        </button>
      </div>

      <div className="mb-6">
        <TransactionList />
      </div>

      <AddTransaction 
        isOpen={isAddTransactionOpen} 
        onClose={() => setIsAddTransactionOpen(false)} 
      />
    </div>
  );
};

export default Transactions;