import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaEdit, FaTrash, FaSort } from 'react-icons/fa';

const TransactionList = () => {
  const { state, dispatch } = useTransactions();
  const { transactions, categories } = state;
  
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filter, setFilter] = useState({ type: 'all', category: 'all' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesType = filter.type === 'all' || transaction.type === filter.type;
      const matchesCategory = filter.category === 'all' || transaction.category === filter.category;
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#cbd5e1';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all text-sm"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="px-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none hover:text-primary-600 transition-colors" 
                  onClick={() => handleSort('date')}
                >
                  <span>Date</span>
                  <span className="ml-1.5">
                    {sortConfig.key === 'date' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none hover:text-primary-600 transition-colors" 
                  onClick={() => handleSort('description')}
                >
                  <span>Description</span>
                  <span className="ml-1.5">
                    {sortConfig.key === 'description' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none hover:text-primary-600 transition-colors" 
                  onClick={() => handleSort('category')}
                >
                  <span>Category</span>
                  <span className="ml-1.5">
                    {sortConfig.key === 'category' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none hover:text-primary-600 transition-colors" 
                  onClick={() => handleSort('amount')}
                >
                  <span>Amount</span>
                  <span className="ml-1.5">
                    {sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                </button>
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                    {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {transaction.description}
                    {transaction.notes && (
                      <p className="text-gray-500 font-normal text-xs mt-0.5 truncate max-w-xs">{transaction.notes}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" 
                      style={{ backgroundColor: `${getCategoryColor(transaction.category)}20`, color: getCategoryColor(transaction.category) }}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span 
                      className={`${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'} font-semibold`}
                    >
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-gray-400 hover:text-primary-600 transition-colors p-1 rounded-full hover:bg-primary-50"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-danger-600 transition-colors p-1 rounded-full hover:bg-danger-50"
                        onClick={() => handleDelete(transaction.id)}
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 font-medium">No transactions found</p>
                    <p className="text-gray-400 text-sm mt-1">Try changing your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;