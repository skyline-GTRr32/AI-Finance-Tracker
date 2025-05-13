import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { categorizeTransaction } from '../services/aiService';
import { FaRobot, FaTimes, FaPlus } from 'react-icons/fa';

const AddTransaction = ({ isOpen, onClose }) => {
  const { state, dispatch } = useTransactions();
  const { categories } = state;
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    subcategory: '',
    type: 'expense',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.description || !formData.amount || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          ...formData,
          amount: parseFloat(formData.amount)
        }
      });

      // Reset form
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        subcategory: '',
        type: 'expense',
        notes: ''
      });

      onClose();
    } catch (err) {
      setError('There was an error adding your transaction.');
      console.error(err);
    }
  };

  const detectCategory = async () => {
    if (!formData.description) {
      setError('Please enter a description first.');
      return;
    }

    setLoading(true);
    try {
      const suggestedCategory = await categorizeTransaction({
        description: formData.description,
        amount: formData.amount
      });
      
      setFormData({
        ...formData,
        category: suggestedCategory
      });
    } catch (err) {
      setError('Could not detect category. Please select manually.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
      <div 
        className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        style={{ animationDuration: '0.3s' }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-lg mr-3">
              <FaPlus size={16} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-danger-50 border border-danger-100 text-danger-700 px-4 py-3 rounded-xl mb-6 flex items-center">
            <span className="mr-2 text-danger-500">
              <FaTimes size={14} />
            </span>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Type
                </label>
                <div className="flex">
                  <button
                    type="button"
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-l-lg focus:outline-none transition-all ${formData.type === 'expense' ? 'bg-danger-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    onClick={() => setFormData({...formData, type: 'expense'})}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-r-lg focus:outline-none transition-all ${formData.type === 'income' ? 'bg-success-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    onClick={() => setFormData({...formData, type: 'income'})}
                  >
                    Income
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description*
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Grocery shopping"
                className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Category*
                </label>
                <button
                  type="button"
                  onClick={detectCategory}
                  className="text-xs flex items-center text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded-md transition-all"
                  disabled={loading}
                >
                  {loading ? 
                    <div className="mr-1.5 animate-spin h-3 w-3 border-2 border-primary-600 border-t-transparent rounded-full"></div> : 
                    <FaRobot className="mr-1.5" size={12} />
                  }
                  Detect with AI
                </button>
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                required
              >
                <option value="">Select a category</option>
                {categories
                  .filter(cat => 
                    cat.type === formData.type || cat.type === 'both'
                  )
                  .map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional details..."
                className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                rows="3"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-sm hover:shadow-md"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;