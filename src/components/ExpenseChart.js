import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTransactions } from '../context/TransactionContext';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

const ExpenseChart = ({ period: initialPeriod = 'month' }) => {
  const { state } = useTransactions();
  const { transactions, categories } = state;
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [period, setPeriod] = useState(initialPeriod);

  useEffect(() => {
    // Filter transactions based on period and type (expenses only)
    const today = new Date();
    const startDate = new Date();
    
    if (period === 'month') {
      startDate.setMonth(today.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(today.getFullYear() - 1);
    } else if (period === 'week') {
      startDate.setDate(today.getDate() - 7);
    }

    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type === 'expense' && transactionDate >= startDate && transactionDate <= today;
    });

    // Group expenses by category
    const expensesByCategory = {};
    filteredTransactions.forEach(transaction => {
      if (expensesByCategory[transaction.category]) {
        expensesByCategory[transaction.category] += transaction.amount;
      } else {
        expensesByCategory[transaction.category] = transaction.amount;
      }
    });

    // Prepare data for chart
    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    const backgroundColors = labels.map(label => {
      const category = categories.find(cat => cat.name === label);
      return category ? category.color : '#cbd5e1';
    });

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color),
          borderWidth: 1,
        },
      ],
    });
  }, [transactions, categories, period]);

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Expenses by Category</h2>
        <div className="bg-gray-50 rounded-lg p-1">
          <select 
            className="bg-transparent px-3 py-1.5 border-none rounded-md focus:outline-none text-sm font-medium text-gray-600"
            defaultValue={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      <div className="h-64">
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
                    padding: 15
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `$${value.toFixed(2)} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;