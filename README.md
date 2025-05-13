# AI Finance Tracker

An intelligent personal finance management application leveraging AI to provide financial insights and help users manage their money more effectively.

![AI Finance Tracker Preview](./public/preview.png)

## 🌟 Overview

AI Finance Tracker is a modern web application that combines sleek UI design with powerful AI capabilities to transform how you manage your personal finances. The application automatically categorizes transactions, provides personalized insights, and helps you optimize your budget through intelligent recommendations.

## ✨ Key Features

- **Intelligent Transaction Management**: Automatic categorization of income and expenses using AI
- **Personalized Financial Insights**: AI-powered analysis of spending patterns and behaviors
- **Budget Planning & Tracking**: Set and monitor category-specific budgets with visual indicators
- **Interactive Analytics Dashboard**: Comprehensive financial overview with dynamic charts
- **OpenRouter AI Integration**: Leverages large language models for financial analysis
- **Responsive Design**: Fully optimized experience across desktop and mobile devices
- **Modern UI/UX**: Clean interface with intuitive navigation and smooth animations

## 🛠️ Technology Stack

- **Frontend**: React.js 18 with functional components and hooks
- **State Management**: React Context API for global state
- **Routing**: React Router v6 for navigation
- **Styling**: Tailwind CSS for utility-first styling approach
- **Data Visualization**: Chart.js with React-ChartJS-2 wrapper
- **HTTP Client**: Axios for API requests
- **AI Provider**: OpenRouter API for intelligent features
- **Unique IDs**: UUID for generating transaction identifiers

## 📊 Features In Detail

### Transaction Management
- Add, edit, and delete income/expense transactions
- Smart categorization based on transaction descriptions
- Filter and search transactions by various criteria

### Budget Planning
- Create personalized budgets for different spending categories
- Visual progress indicators for budget tracking
- Alerts and notifications for approaching budget limits

### Financial Analytics
- Monthly spending breakdown by category
- Income vs. expenses comparison
- Spending trends analysis over time
- Projection of future financial status

### AI-Powered Insights
- Transaction pattern recognition
- Spending anomaly detection
- Custom budget recommendations
- Savings opportunity identification

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-finance-tracker.git

# Navigate to project directory
cd ai-finance-tracker

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at http://localhost:3000

### OpenRouter API Setup

1. Create an account at [OpenRouter](https://openrouter.ai/)
2. Generate an API key in your dashboard
3. Add the API key in the application settings

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── layout/     # Layout components (Header, Sidebar, etc.)
│   ├── charts/     # Chart components for data visualization
│   ├── forms/      # Form components and controls
│   └── ui/         # Basic UI elements (buttons, cards, etc.)
├── context/        # Global state management
│   ├── AuthContext.js      # Authentication state
│   ├── TransactionContext.js # Transaction data state
│   └── BudgetContext.js    # Budget management state
├── pages/          # Main application pages
│   ├── Dashboard/  # Main dashboard view
│   ├── Transactions/ # Transaction management
│   ├── Budgets/    # Budget planning and tracking
│   ├── Insights/   # AI-powered financial insights
│   └── Settings/   # User preferences and API configuration
├── services/       # API and data services
│   ├── apiService.js # Axios configuration and API calls
│   ├── openRouterService.js # OpenRouter AI integration
│   └── storageService.js # Local storage management
├── middleware/     # Request/response interceptors
└── App.js          # Main application component
```

## ⚙️ Configuration

The application can be configured through environment variables:

```
REACT_APP_API_URL=your_api_url
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenRouter for providing the AI API infrastructure
- React and TailwindCSS teams for the amazing development tools
- All contributors who have helped shape this project