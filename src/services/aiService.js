import axios from 'axios';

// Get API key from localStorage or use fallback
const getApiKey = () => {
  // Updated with a default key that should work, but users should replace with their own
  return localStorage.getItem('openrouter_api_key') || 'placeholder-key';
};

// Check if mock data should be used instead of real API calls
const shouldUseMockData = () => {
  return localStorage.getItem('use_mock_data') === 'true';
};

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Mock data for when API is unavailable
const getMockFinancialSuggestions = () => {
  return `Based on your transaction history and budget information, here are some personalized financial suggestions:

1. Your Food expenses are 15% above your budget. Consider meal planning to reduce grocery costs.

2. You're spending $150 monthly on subscription services. Review these subscriptions to identify any you could eliminate.

3. Your Transportation costs show frequent small transactions. Combining errands could help reduce fuel expenses.

4. Utilities spending increased 20% compared to last month. Check for seasonal adjustments or potential issues.

5. You have no current savings allocation. Consider setting up an automatic transfer of 5-10% of income to a savings account.`;
};

const getMockCategorization = (description) => {
  // Simple mock categorization based on keywords
  const desc = description.toLowerCase();
  if (desc.includes('grocery') || desc.includes('restaurant')) return 'Food';
  if (desc.includes('gas') || desc.includes('uber')) return 'Transportation';
  if (desc.includes('rent') || desc.includes('mortgage')) return 'Housing';
  if (desc.includes('movie') || desc.includes('netflix')) return 'Entertainment';
  if (desc.includes('doctor') || desc.includes('pharmacy')) return 'Healthcare';
  if (desc.includes('salary') || desc.includes('deposit')) return 'Income';
  return 'Other';
};

const getMockSpendingInsights = () => {
  return `Spending Patterns:
1. Income and Expenses:
- Your primary income source is a monthly salary of $2,500, which is credited to your account on the 15th of each month.
- Your major expense is rent, which amounts to $800 per month, accounting for 32% of your total income.
- Grocery expenses of $120 per month make up 4.8% of your total income.
- Fuel expenses of $55 per month account for 2.2% of your total income.

2. Spending Trends:
- Your spending pattern appears to be relatively consistent, with the majority of your expenses being fixed (rent) and recurring (groceries and fuel).
- There are no significant fluctuations or unusual expenses in the data provided.

Potential Savings:
- Given that your major expense is rent, which accounts for a substantial portion of your income, there may be opportunities to explore more cost-effective housing options or negotiate a lower rent.
- Your grocery expenses seem reasonable, but you could potentially look for ways to optimize your spending in this category, such as meal planning, couponing, or shopping at more affordable grocery stores.
- Your fuel expenses are relatively low, which suggests you may be managing your transportation costs efficiently.

Recommendations:
- Review your housing options to see if you can find a more affordable rental that still meets your needs.
- Analyze your grocery spending in more detail to identify potential areas for optimization, such as buying in bulk, utilizing coupons, or switching to less expensive brands.
- Consider setting up a budget and tracking your expenses more closely to identify any other areas where you can reduce spending or increase savings.
- Diversify your income sources or explore opportunities for additional income streams to increase your overall financial resilience.

Overall, your spending patterns appear to be relatively stable and well-managed. However, there may be opportunities to optimize your housing and grocery expenses, which could lead to increased savings and financial flexibility.`;
};

export const getAIFinanceSuggestions = async (transactions, budget) => {
  // If mock data is enabled, return mock suggestions
  if (shouldUseMockData()) {
    return getMockFinancialSuggestions();
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'anthropic/claude-3-haiku', // Using Claude 3 Haiku as an example
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor AI focused on helping users manage their personal finances. Provide specific, actionable advice based on transaction and budget data.'
          },
          {
            role: 'user',
            content: `Here are my recent transactions: ${JSON.stringify(transactions)}. 
                      And my current budget: ${JSON.stringify(budget)}. 
                      Please analyze my spending patterns and provide 3-5 specific suggestions to improve my financial health.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${getApiKey()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    
    let errorMessage = 'Unable to retrieve AI suggestions at this time. Please try again later.';
    
    // Provide more specific error messages based on the error
    if (error.response) {
      // The request was made and the server responded with a status code
      if (error.response.status === 401) {
        errorMessage = 'API Key authentication failed. Please check your OpenRouter API key in Settings.';
      } else if (error.response.status === 403) {
        errorMessage = 'Access forbidden. Your API key may not have permission to use this model.';
      } else if (error.response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later or check your OpenRouter plan.';
      }
      console.error('API response error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from API server. Please check your internet connection.';
    }
    
    return errorMessage;
  }
};

export const categorizeTransaction = async (transaction) => {
  // If mock data is enabled, return mock categorization
  if (shouldUseMockData()) {
    return getMockCategorization(transaction.description);
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are a financial categorization assistant. Your job is to categorize financial transactions. Respond with the most appropriate category name only.'
          },
          {
            role: 'user',
            content: `Please categorize this transaction: Description: ${transaction.description}, Amount: ${transaction.amount}. 
                      Respond with one of these categories: Income, Housing, Food, Transportation, Entertainment, Healthcare, Education, Shopping, Utilities, Travel, Other.`
          }
        ],
        temperature: 0.3,
        max_tokens: 20
      },
      {
        headers: {
          'Authorization': `Bearer ${getApiKey()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error categorizing transaction:', error);
    
    // For categorization failures, default to 'Other' but log detailed error info
    if (error.response) {
      console.error('API response error:', error.response.data);
    }
    
    return 'Other';
  }
};

export const getSpendingInsights = async (transactions, timeframe = 'monthly') => {
  // If mock data is enabled, return mock insights
  if (shouldUseMockData()) {
    return getMockSpendingInsights();
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analysis AI that provides insights on spending patterns. Focus on trends, anomalies, and actionable insights.'
          },
          {
            role: 'user',
            content: `Here are my ${timeframe} transactions: ${JSON.stringify(transactions)}. 
                      Please analyze and provide detailed insights about my spending patterns, unusual expenses, potential savings, and trends.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${getApiKey()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting spending insights:', error);
    
    let errorMessage = 'Unable to analyze spending patterns at this time. Please try again later.';
    
    // Provide more specific error messages based on the error
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'API Key authentication failed. Please check your OpenRouter API key in Settings.';
      } else if (error.response.status === 403) {
        errorMessage = 'Access forbidden. Your API key may not have permission to use this model.';
      } else if (error.response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later or check your OpenRouter plan.';
      }
      console.error('API response error:', error.response.data);
    } else if (error.request) {
      errorMessage = 'No response from API server. Please check your internet connection.';
    }
    
    return errorMessage;
  }
};

export default {
  getAIFinanceSuggestions,
  categorizeTransaction,
  getSpendingInsights
};