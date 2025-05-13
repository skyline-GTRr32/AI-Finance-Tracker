import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaSync, FaTimes, FaPiggyBank, FaChartBar, FaListUl } from 'react-icons/fa';
import { useTransactions } from '../context/TransactionContext';
import { getSpendingInsights } from '../services/aiService';

const AiInsights = () => {
  const { state } = useTransactions();
  const { transactions } = state;
  
  const [activeTab, setActiveTab] = useState('spending');
  const [insights, setInsights] = useState({
    spending: '',
    savings: '',
    recommendations: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current month transactions
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthlyTransactions = transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      const aiResponse = await getSpendingInsights(monthlyTransactions, 'monthly');
      
      // Parse AI response into different sections
      const spendingPattern = extractSection(aiResponse, 'Spending Patterns', 'Potential Savings');
      const savingsOptions = extractSection(aiResponse, 'Potential Savings', 'Recommendations');
      const recommendations = extractSection(aiResponse, 'Recommendations', 'Overall');
      
      setInsights({
        spending: spendingPattern || 'No spending pattern insights available.',
        savings: savingsOptions || 'No savings insights available.',
        recommendations: recommendations || 'No recommendations available.'
      });
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Unable to generate AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [transactions]);
  
  // Helper function to extract sections from AI response
  const extractSection = (text, startMarker, endMarker) => {
    if (!text) return '';
    
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';
    
    const endIndex = endMarker ? text.indexOf(endMarker, startIndex) : text.length;
    if (endIndex === -1) return text.substring(startIndex);
    
    return text.substring(startIndex, endIndex).trim();
  };

  useEffect(() => {
    // Fetch insights on component mount if we have transaction data
    if (transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions.length, fetchInsights]);

  // Render tab contents based on active tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative">
            <FaChartLine className="text-5xl text-indigo-400 animate-pulse-slow" />
            <div className="absolute -top-2 -right-2 bg-indigo-100 text-indigo-600 p-1 rounded-full animate-pulse">
              <FaSync size={10} />
            </div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">Analyzing your financial data...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-4 flex items-start">
          <span className="mr-2 mt-0.5 text-red-500">
            <FaTimes size={14} />
          </span>
          <div>
            <p className="font-medium">{error}</p>
            {error.includes('API Key') && (
              <p className="text-sm mt-2">
                Please go to <Link to="/settings" className="text-indigo-600 hover:underline">Settings</Link> to configure your OpenRouter API key.
              </p>
            )}
          </div>
        </div>
      );
    }

    // Create a formatted display of the current tab's content
    let content = insights[activeTab];
    if (!content) return <p className="text-gray-500">No data available for this section.</p>;

    // Format the content into paragraphs
    return (
      <div className="prose max-w-none text-gray-700">
        {content.split('\n').map((paragraph, index) => {
          if (paragraph.trim().startsWith('-')) {
            return (
              <div key={index} className="flex items-start mb-2">
                <span className="text-indigo-500 mr-2 mt-1">&bull;</span>
                <p className="m-0">{paragraph.substring(1).trim()}</p>
              </div>
            );
          } else if (paragraph.trim().startsWith('1.') || paragraph.trim().startsWith('2.') || 
                     paragraph.trim().startsWith('3.') || paragraph.trim().startsWith('4.')) {
            return (
              <h4 key={index} className="font-semibold mt-4 mb-2">{paragraph.trim()}</h4>
            );
          } else if (paragraph.trim()) {
            return <p key={index} className="mb-3">{paragraph.trim()}</p>;
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
            <FaChartLine size={16} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">AI Financial Insights</h2>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-2 transition-colors text-sm"
        >
          <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={14} />
          Refresh
        </button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('spending')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'spending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaChartBar className="mr-2" />
            Spending Patterns
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'savings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaPiggyBank className="mr-2" />
            Potential Savings
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'recommendations'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaListUl className="mr-2" />
            Recommendations
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="py-2">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AiInsights;