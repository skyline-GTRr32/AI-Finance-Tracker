import React, { useState } from 'react';
import { FaCog, FaTags, FaKey, FaRegSave, FaTrash } from 'react-icons/fa';
import { useTransactions } from '../context/TransactionContext';

const Settings = () => {
  const { state, dispatch } = useTransactions();
  const { categories } = state;
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense',
    color: '#6366f1' // Default color
  });
  
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_api_key') || '');
  const [useMockData, setUseMockData] = useState(localStorage.getItem('use_mock_data') === 'true');
  const [showApiSaved, setShowApiSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');

  const handleAddCategory = (e) => {
    e.preventDefault();
    
    if (!newCategory.name) return;
    
    dispatch({
      type: 'ADD_CATEGORY',
      payload: newCategory
    });
    
    setNewCategory({
      name: '',
      type: 'expense',
      color: '#6366f1'
    });
  };

  const handleSaveApiKey = () => {
    // In a real app, you would save this to secure storage
    // Here we're just simulating that behavior
    localStorage.setItem('openrouter_api_key', apiKey);
    setShowApiSaved(true);
    
    setTimeout(() => {
      setShowApiSaved(false);
    }, 3000);
  };

  const handleToggleMockData = (e) => {
    const isChecked = e.target.checked;
    setUseMockData(isChecked);
    localStorage.setItem('use_mock_data', isChecked);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <FaCog className="text-primary-500 mr-2 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'categories' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            <FaTags className="inline mr-1" />
            Categories
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'api' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('api')}
          >
            <FaKey className="inline mr-1" />
            API Settings
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'categories' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Manage Categories</h2>
              
              <form onSubmit={handleAddCategory} className="mb-6 flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="New category name"
                  />
                </div>
                
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add
                </button>
              </form>
              
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Current Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div 
                      key={category.id} 
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2 flex-shrink-0" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span>{category.name}</span>
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {category.type}
                        </span>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => {
                          if (window.confirm(`Delete category "${category.name}"?`)) {
                            // In a real app, you would need to check if this category is in use
                            // and provide appropriate warnings/migration options
                            dispatch({
                              type: 'DELETE_CATEGORY',
                              payload: category.id
                            });
                          }
                        }}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OpenRouter API Key
                </label>
                <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 mb-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> A valid OpenRouter API key is required for AI functionality. 
                    The placeholder key is for demonstration only and won't work for actual API calls.
                  </p>
                </div>
                <div className="flex">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your OpenRouter API key"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 flex items-center"
                  >
                    <FaRegSave className="mr-1" />
                    Save
                  </button>
                </div>
                {showApiSaved && (
                  <p className="mt-2 text-sm text-green-600">API key saved successfully</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  This key is used for AI-powered features like transaction categorization and financial insights.
                  You can get an API key from <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">OpenRouter</a>.
                </p>
                
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="use_mock_data"
                    checked={useMockData}
                    onChange={handleToggleMockData}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="use_mock_data" className="ml-2 block text-sm text-gray-700">
                    Use demo data (bypasses API calls)
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enable this option to use fictional data instead of real API calls. Useful for testing or when you don't have an API key.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                <h3 className="text-md font-medium text-yellow-800 mb-2">About AI Features</h3>
                <p className="text-sm text-yellow-700">
                  The AI Finance Tracker uses large language models to analyze your financial data and provide personalized insights.
                  Your data is only processed when you explicitly request AI analysis, and we never store your transactions on our servers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;