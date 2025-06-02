import { useState } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'BarChart3' },
    { id: 'farms', name: 'Farms', icon: 'MapPin' },
    { id: 'crops', name: 'Crops', icon: 'Wheat' },
    { id: 'tasks', name: 'Tasks', icon: 'CheckSquare' },
    { id: 'expenses', name: 'Expenses', icon: 'DollarSign' },
    { id: 'reports', name: 'Reports', icon: 'TrendingUp' },
    { id: 'weather', name: 'Weather', icon: 'Cloud' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary-light to-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Manage Your Farm with
            <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Digital Precision
            </span>
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            Track crops, manage tasks, monitor expenses, and stay ahead of weather patterns 
            with our comprehensive farm management platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">Increase Productivity</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <ApperIcon name="Shield" className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">Reduce Costs</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <ApperIcon name="Calendar" className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">Better Planning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-card'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainFeature activeTab={activeTab} />
      </div>
    </div>
  )
}

export default Home