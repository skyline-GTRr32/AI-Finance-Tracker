import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaRegEdit, FaRegTrashAlt, FaPlus } from 'react-icons/fa';

const Budget = () => {
  const { state, dispatch } = useTransactions();
  const { budgets, categories, transactions } = state;
  
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [editingId, setEditingId] = useState(null);
  const [spending, setSpending] = useState({});

  useEffect(() => {
    // Calculate spending for each category based on current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear &&
             transaction.type === 'expense';
    });
    
    const categorySpending = {};
    currentMonthTransactions.forEach(transaction => {
      if (categorySpending[transaction.category]) {
        categorySpending[transaction.category] += transaction.amount;
      } else {
        categorySpending[transaction.category] = transaction.amount;
      }
    });
    
    setSpending(categorySpending);
  }, [transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      dispatch({
        type: 'UPDATE_BUDGET',
        payload: {
          ...newBudget,
          id: editingId,
          amount: parseFloat(newBudget.amount)
        }
      });
    } else {
      dispatch({
        type: 'ADD_BUDGET',
        payload: {
          ...newBudget,
          amount: parseFloat(newBudget.amount)
        }
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setNewBudget({
      category: '',
      amount: '',
      period: 'monthly'
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEdit = (budget) => {
    setNewBudget({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setEditingId(budget.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      dispatch({
        type: 'DELETE_BUDGET',
        payload: id
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculatePercentage = (spent, budgeted) => {
    if (!budgeted) return 0;
    const percentage = (spent / budgeted) * 100;
    return Math.min(percentage, 100); // Cap at 100% for the progress bar
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#cbd5e1';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budget Planner</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-1" /> Add Budget
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Budgets</h2>
        
        {isEditing && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter(cat => cat.type === 'expense')
                    .map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
              >
                {editingId ? 'Update' : 'Add'} Budget
              </button>
            </div>
          </form>
        )}
        
        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map(budget => {
              const spent = spending[budget.category] || 0;
              const percentage = calculatePercentage(spent, budget.amount);
              const isOverBudget = spent > budget.amount;
              
              return (
                <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: getCategoryColor(budget.category) }}
                      ></div>
                      <h3 className="text-lg font-medium">{budget.category}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-gray-500 hover:text-primary-600"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-2">
                    <div>Budgeted: {formatCurrency(budget.amount)}</div>
                    <div className="text-right">
                      Spent: <span className={isOverBudget ? 'text-red-600 font-medium' : ''}>{formatCurrency(spent)}</span>
                    </div>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary-600">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary-600">
                          {formatCurrency(budget.amount - spent)} remaining
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          isOverBudget ? 'bg-red-500' : 'bg-primary-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No budgets set yet</p>
            <p className="text-sm">Set a budget to track your spending</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;