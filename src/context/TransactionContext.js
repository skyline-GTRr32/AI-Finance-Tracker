import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TransactionContext = createContext();

// Sample initial data
const INITIAL_STATE = {
  transactions: [
    {
      id: '1',
      amount: 2500,
      category: 'Income',
      subcategory: 'Salary',
      date: '2025-03-15',
      description: 'Monthly salary',
      type: 'income'
    },
    {
      id: '2',
      amount: 800,
      category: 'Housing',
      subcategory: 'Rent',
      date: '2025-03-10',
      description: 'Monthly rent',
      type: 'expense'
    },
    {
      id: '3',
      amount: 120,
      category: 'Food',
      subcategory: 'Groceries',
      date: '2025-03-08',
      description: 'Weekly groceries',
      type: 'expense'
    },
    {
      id: '4',
      amount: 55,
      category: 'Transportation',
      subcategory: 'Fuel',
      date: '2025-03-05',
      description: 'Gas refill',
      type: 'expense'
    }
  ],
  categories: [
    { id: '1', name: 'Income', type: 'income', color: '#4ade80' },
    { id: '2', name: 'Housing', type: 'expense', color: '#f43f5e' },
    { id: '3', name: 'Food', type: 'expense', color: '#fb923c' },
    { id: '4', name: 'Transportation', type: 'expense', color: '#60a5fa' },
    { id: '5', name: 'Entertainment', type: 'expense', color: '#a78bfa' },
    { id: '6', name: 'Healthcare', type: 'expense', color: '#34d399' },
    { id: '7', name: 'Education', type: 'expense', color: '#fbbf24' }
  ],
  budgets: [
    { id: '1', category: 'Housing', amount: 1000, period: 'monthly' },
    { id: '2', category: 'Food', amount: 500, period: 'monthly' },
    { id: '3', category: 'Transportation', amount: 200, period: 'monthly' },
    { id: '4', category: 'Entertainment', amount: 150, period: 'monthly' }
  ],
  aiSuggestions: []
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_BUDGETS':
      return {
        ...state,
        budgets: action.payload
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, { ...action.payload, id: uuidv4() }]
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, { ...action.payload, id: uuidv4() }]
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    case 'SET_AI_SUGGESTIONS':
      return {
        ...state,
        aiSuggestions: action.payload
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, { ...action.payload, id: uuidv4() }]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.id === action.payload.id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, INITIAL_STATE);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.transactions && parsedData.transactions.length > 0) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: parsedData.transactions });
      }
      if (parsedData.categories && parsedData.categories.length > 0) {
        dispatch({ type: 'SET_CATEGORIES', payload: parsedData.categories });
      }
      if (parsedData.budgets && parsedData.budgets.length > 0) {
        dispatch({ type: 'SET_BUDGETS', payload: parsedData.budgets });
      }
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify({
      transactions: state.transactions,
      categories: state.categories,
      budgets: state.budgets
    }));
  }, [state.transactions, state.categories, state.budgets]);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  return useContext(TransactionContext);
};

export default TransactionContext;