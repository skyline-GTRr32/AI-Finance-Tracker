import React, { useState, useEffect } from 'react';
import { FaRobot, FaSync, FaChartLine, FaBullseye, FaRegLightbulb } from 'react-icons/fa';
import { useTransactions } from '../context/TransactionContext';
import { getSpendingInsights } from '../services/aiService';

const Insights = () => {
  const { state } = useTransactions();
  const { transactions } = state;
  
  const [insights, setInsights] = useState({
    spendingPatterns: '',
    savingTips: '',
    budgetRecommendations: ''
  });
  const [timeframe, setTimeframe] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter transactions based on timeframe
      const filteredTransactions = filterTransactionsByTimeframe(transactions, timeframe);
      
      // Get AI insights
      const aiResponse = await getSpendingInsights(filteredTransactions, timeframe);
      
      // Parse insights from AI response
      // This parsing depends on how your AI model returns data
      // Here we're assuming it returns sections with headers
      const sections = parseAIResponse(aiResponse);
      
      setInsights(sections);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Unable to generate insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const filterTransactionsByTimeframe = (transactions, timeframe) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // Default to monthly
    }
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  };
  
  const parseAIResponse = (response) => {
    // This is a simplified parser that assumes certain structure
    // You might need to adjust this based on the actual AI response format
    
    // Look for common section headers in the AI response
    const spendingPatternRegex = /(spending patterns|spending analysis|expense analysis):/i;
    const savingTipsRegex = /(saving tips|savings opportunities|ways to save):/i;
    const budgetRecommendationsRegex = /(budget recommendations|budget suggestions|budget advice):/i;
    
    // Split the response into sections
    const sections = response.split(/\n\n|\r\n\r\n/);
    
    let spendingPatterns = '';
    let savingTips = '';
    let budgetRecommendations = '';
    
    // Simple parsing logic to extract sections
    for (const section of sections) {
      if (spendingPatternRegex.test(section)) {
        spendingPatterns = section;
      } else if (savingTipsRegex.test(section)) {
        savingTips = section;
      } else if (budgetRecommendationsRegex.test(section)) {
        budgetRecommendations = section;
      }
    }
    
    // If sections weren't clearly identified, use the whole response
    if (!spendingPatterns && !savingTips && !budgetRecommendations) {
      return {
        spendingPatterns: response,
        savingTips: '',
        budgetRecommendations: ''
      };
    }
    
    return {
      spendingPatterns,
      savingTips,
      budgetRecommendations
    };
  };
  
  useEffect(() => {
    if (transactions.length > 0) {
      fetchInsights();
    }
  }, [timeframe]); // eslint-disable-line react-hooks/exhaustive-deps

  const InsightCard = ({ title, content, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <span className="mr-2 text-primary-500">{icon}</span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      {content ? (
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{content}</p>
        </div>
      ) : (
        <p className="text-gray-500 italic">No insights available</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaRobot className="text-primary-500 mr-2 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-800">AI Financial Insights</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="weekly">Last Week</option>
            <option value="monthly">Last Month</option>
            <option value="yearly">Last Year</option>
          </select>
          
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaSync className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-10 mb-6 flex flex-col items-center justify-center">
          <FaRobot className="text-5xl mb-4 text-primary-400 animate-pulse" />
          <p className="text-lg text-gray-700 mb-2">Analyzing your financial data...</p>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      ) : (
        <>
          <InsightCard 
            title="Spending Patterns" 
            content={insights.spendingPatterns}
            icon={<FaChartLine />}
          />
          
          <InsightCard 
            title="Saving Opportunities" 
            content={insights.savingTips}
            icon={<FaRegLightbulb />}
          />
          
          <InsightCard 
            title="Budget Recommendations" 
            content={insights.budgetRecommendations}
            icon={<FaBullseye />}
          />
        </>
      )}
    </div>
  );
};

export default Insights;