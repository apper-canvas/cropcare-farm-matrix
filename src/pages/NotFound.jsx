import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-card">
            <ApperIcon name="Sprout" className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
            Field Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Looks like this crop field doesn't exist in our farm management system. 
            Let's get you back to your dashboard.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-xl font-medium shadow-card hover:shadow-soft transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Home" className="h-5 w-5" />
          <span>Return to Farm</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound