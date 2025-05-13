import React, { useState, useEffect } from 'react';
import { FaWallet, FaPiggyBank, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useTransactions } from '../context/TransactionContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import AddTransaction from '../components/AddTransaction';
import AiInsights from '../components/AiInsights';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

const Dashboard = () => {
  const { state } = useTransactions();
  const { transactions, categories } = state;
  
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savingsRate: 0
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  // Calculate financial summary and prepare chart data
  useEffect(() => {
    // Financial summary calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    // Calculate totals
    const monthlyIncome = currentMonthTransactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const monthlyExpenses = currentMonthTransactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const balance = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    
    // Get previous month data for comparison
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });
    
    const lastMonthIncome = lastMonthTransactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const lastMonthExpenses = lastMonthTransactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Calculate percentage changes
    const incomeChange = lastMonthIncome > 0 
      ? (((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
      : 0;
    
    const expensesChange = lastMonthExpenses > 0
      ? (((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
      : 0;
    
    setSummary({
      balance,
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savingsRate: savingsRate.toFixed(1),
      incomeChange,
      expensesChange,
      incomeChangeType: monthlyIncome >= lastMonthIncome ? 'positive' : 'negative',
      expensesChangeType: monthlyExpenses <= lastMonthExpenses ? 'positive' : 'negative'
    });

    // Prepare expense chart data
    const expensesByCategory = {};
    currentMonthTransactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        const { category, amount } = transaction;
        if (expensesByCategory[category]) {
          expensesByCategory[category] += amount;
        } else {
          expensesByCategory[category] = amount;
        }
      });

    const chartLabels = Object.keys(expensesByCategory);
    const chartValues = Object.values(expensesByCategory);
    const chartColors = chartLabels.map(label => {
      const category = categories.find(cat => cat.name === label);
      return category ? category.color : '#cbd5e1';
    });

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          data: chartValues,
          backgroundColor: chartColors,
          borderColor: chartColors.map(color => color),
          borderWidth: 1,
        }
      ]
    });
  }, [transactions, categories]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Financial Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and manage your financial health</p>
        </div>
        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-sm transition-all"
        >
          <span className="mr-2">+</span> Add Transaction
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Balance Card */}
        <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-700">Current Balance</h2>
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <FaWallet size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-700">{formatCurrency(summary.balance)}</p>
        </div>

        {/* Income Card */}
        <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-700">Monthly Income</h2>
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <FaArrowUp size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700">{formatCurrency(summary.income)}</p>
          {summary.incomeChange !== 0 && (
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                summary.incomeChangeType === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {summary.incomeChangeType === 'positive' ? <FaArrowUp size={10} className="mr-1" /> : <FaArrowDown size={10} className="mr-1" />}
                {Math.abs(summary.incomeChange)}%
              </span>
            </div>
          )}
        </div>

        {/* Expenses Card */}
        <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-700">Monthly Expenses</h2>
            <div className="bg-red-100 text-red-600 p-2 rounded-lg">
              <FaArrowDown size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-700">{formatCurrency(summary.expenses)}</p>
          {summary.expensesChange !== 0 && (
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                summary.expensesChangeType === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {summary.expensesChangeType === 'positive' ? <FaArrowDown size={10} className="mr-1" /> : <FaArrowUp size={10} className="mr-1" />}
                {Math.abs(summary.expensesChange)}%
              </span>
            </div>
          )}
        </div>

        {/* Savings Rate Card */}
        <div className="bg-indigo-50 rounded-xl p-6 shadow-sm border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-700">Savings Rate</h2>
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
              <FaPiggyBank size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-indigo-700">{summary.savingsRate}%</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Expenses Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Expenses by Category</h2>
            <div className="mt-2 sm:mt-0">
              <select 
                className="bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                defaultValue="month"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            {chartData.labels.length > 0 ? (
              <Pie 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${formatCurrency(value)} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="text-gray-500">
                No expense data available for this period
              </div>
            )}
          </div>
        </div>

        {/* AI Financial Insights */}
        <div className="lg:col-span-1">
          <AiInsights />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{ 
                          backgroundColor: `${categories.find(c => c.name === transaction.category)?.color}20`, 
                          color: categories.find(c => c.name === transaction.category)?.color 
                        }}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <AddTransaction 
        isOpen={isAddTransactionOpen} 
        onClose={() => setIsAddTransactionOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;