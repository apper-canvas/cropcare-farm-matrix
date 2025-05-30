import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ activeTab }) => {
  // Sample data and state management
  const [farms, setFarms] = useState([
    { id: '1', name: 'North Field', location: 'Valley District', size: 50, sizeUnit: 'acres', createdDate: new Date() }
  ])
  
  const [crops, setCrops] = useState([
    { 
      id: '1', 
      farmId: '1', 
      cropType: 'Corn', 
      variety: 'Sweet Corn', 
      plantingDate: new Date(), 
      expectedHarvestDate: addDays(new Date(), 90),
      status: 'Growing',
      notes: 'First planting of the season'
    }
  ])
  
  const [tasks, setTasks] = useState([
    {
      id: '1',
      farmId: '1',
      cropId: '1',
      title: 'Water crops',
      description: 'Morning irrigation',
      dueDate: new Date(),
      priority: 'High',
      completed: false,
      taskType: 'Maintenance'
    }
  ])
  
  const [expenses, setExpenses] = useState([
    {
      id: '1',
      farmId: '1',
      amount: 150,
      category: 'Seeds',
      description: 'Corn seeds purchase',
      date: new Date(),
      receipt: ''
    }
  ])

  const [weather] = useState({
    location: 'Farm Location',
    currentTemp: 24,
    condition: 'Sunny',
    humidity: 65,
    forecast: [
      { date: 'Today', temp: 24, condition: 'Sunny', icon: 'Sun' },
      { date: 'Tomorrow', temp: 22, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { date: 'Day 3', temp: 19, condition: 'Rainy', icon: 'CloudRain' }
    ]
  })

  // Form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  const resetForm = () => {
    setFormData({})
    setEditingItem(null)
    setShowAddForm(false)
  }

  const handleAdd = (type) => {
    const newItem = {
      id: Date.now().toString(),
      ...formData,
      createdDate: new Date()
    }

    switch (type) {
      case 'farm':
        setFarms([...farms, newItem])
        toast.success('Farm added successfully!')
        break
      case 'crop':
        setCrops([...crops, newItem])
        toast.success('Crop logged successfully!')
        break
      case 'task':
        setTasks([...tasks, newItem])
        toast.success('Task created successfully!')
        break
      case 'expense':
        setExpenses([...expenses, newItem])
        toast.success('Expense recorded successfully!')
        break
    }
    resetForm()
  }

  const handleEdit = (type, item) => {
    setEditingItem({ type, item })
    setFormData(item)
    setShowAddForm(true)
  }

  const handleUpdate = (type) => {
    const updatedItem = { ...editingItem.item, ...formData }
    
    switch (type) {
      case 'farm':
        setFarms(farms.map(f => f.id === updatedItem.id ? updatedItem : f))
        toast.success('Farm updated successfully!')
        break
      case 'crop':
        setCrops(crops.map(c => c.id === updatedItem.id ? updatedItem : c))
        toast.success('Crop updated successfully!')
        break
      case 'task':
        setTasks(tasks.map(t => t.id === updatedItem.id ? updatedItem : t))
        toast.success('Task updated successfully!')
        break
      case 'expense':
        setExpenses(expenses.map(e => e.id === updatedItem.id ? updatedItem : e))
        toast.success('Expense updated successfully!')
        break
    }
    resetForm()
  }

  const handleDelete = (type, id) => {
    switch (type) {
      case 'farm':
        setFarms(farms.filter(f => f.id !== id))
        toast.success('Farm deleted successfully!')
        break
      case 'crop':
        setCrops(crops.filter(c => c.id !== id))
        toast.success('Crop removed successfully!')
        break
      case 'task':
        setTasks(tasks.filter(t => t.id !== id))
        toast.success('Task deleted successfully!')
        break
      case 'expense':
        setExpenses(expenses.filter(e => e.id !== id))
        toast.success('Expense deleted successfully!')
        break
    }
  }

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
    const task = tasks.find(t => t.id === taskId)
    toast.success(`Task ${task.completed ? 'marked incomplete' : 'completed'}!`)
  }

  // Dashboard Stats
  const stats = {
    totalFarms: farms.length,
    totalCrops: crops.length,
    pendingTasks: tasks.filter(t => !t.completed).length,
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0)
  }

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Farms</p>
              <p className="text-3xl font-bold">{stats.totalFarms}</p>
            </div>
            <ApperIcon name="MapPin" className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Active Crops</p>
              <p className="text-3xl font-bold">{stats.totalCrops}</p>
            </div>
            <ApperIcon name="Wheat" className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-accent to-red-600 text-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold">{stats.pendingTasks}</p>
            </div>
            <ApperIcon name="CheckSquare" className="h-8 w-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold">${stats.totalExpenses}</p>
            </div>
            <ApperIcon name="DollarSign" className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
          <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center">
            <ApperIcon name="Clock" className="h-5 w-5 mr-2 text-primary" />
            Recent Tasks
          </h3>
          <div className="space-y-3">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="task-item">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        task.completed
                          ? 'bg-primary border-primary text-white'
                          : 'border-surface-300 dark:border-surface-600'
                      }`}
                    >
                      {task.completed && <ApperIcon name="Check" className="h-3 w-3" />}
                    </button>
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-surface-500' : 'text-surface-900 dark:text-surface-100'}`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        Due: {format(task.dueDate, 'MMM dd')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="weather-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <ApperIcon name="Cloud" className="h-5 w-5 mr-2" />
            Weather Forecast
          </h3>
          <div className="mb-4">
            <p className="text-3xl font-bold text-white">{weather.currentTemp}°C</p>
            <p className="text-blue-100">{weather.condition}</p>
            <p className="text-blue-100 text-sm">Humidity: {weather.humidity}%</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {weather.forecast.map((day, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-sm text-blue-100 mb-1">{day.date}</p>
                <ApperIcon name={day.icon} className="h-6 w-6 text-white mx-auto mb-1" />
                <p className="text-white font-semibold">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderFarms = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Farm Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Farm</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map(farm => (
          <div key={farm.id} className="farm-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="MapPin" className="h-6 w-6 text-white" />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit('farm', farm)}
                  className="p-2 text-surface-600 hover:text-primary transition-colors"
                >
                  <ApperIcon name="Edit2" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete('farm', farm.id)}
                  className="p-2 text-surface-600 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              {farm.name}
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-2">{farm.location}</p>
            <p className="text-surface-700 dark:text-surface-300 font-medium">
              {farm.size} {farm.sizeUnit}
            </p>
          </div>
        ))}
      </div>

      {/* Add/Edit Farm Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
                {editingItem ? 'Edit Farm' : 'Add New Farm'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Farm Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                />
                <div className="flex space-x-3">
                  <input
                    type="number"
                    placeholder="Size"
                    value={formData.size || ''}
                    onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) })}
                    className="input-field flex-1"
                  />
                  <select
                    value={formData.sizeUnit || 'acres'}
                    onChange={(e) => setFormData({ ...formData, sizeUnit: e.target.value })}
                    className="input-field w-24"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => editingItem ? handleUpdate('farm') : handleAdd('farm')}
                  className="btn-primary flex-1"
                >
                  {editingItem ? 'Update' : 'Add'} Farm
                </button>
                <button
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'farms':
        return renderFarms()
      case 'crops':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ApperIcon name="Wheat" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Crop Management
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Coming soon - Track your crop lifecycles and growth stages
            </p>
          </motion.div>
        )
      case 'tasks':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ApperIcon name="CheckSquare" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Task Management
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Coming soon - Schedule and track your farming tasks
            </p>
          </motion.div>
        )
      case 'expenses':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ApperIcon name="DollarSign" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Expense Tracking
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Coming soon - Monitor and categorize your farm expenses
            </p>
          </motion.div>
        )
      case 'weather':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="weather-card p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Weather Forecast</h2>
                <p className="text-blue-100">{weather.location}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">{weather.currentTemp}°C</div>
                  <div className="text-xl text-blue-100 mb-4">{weather.condition}</div>
                  <div className="text-blue-100">Humidity: {weather.humidity}%</div>
                </div>
                <div className="flex items-center justify-center">
                  <ApperIcon name="Sun" className="h-24 w-24 text-yellow-300" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <p className="text-blue-100 mb-2">{day.date}</p>
                    <ApperIcon name={day.icon} className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-white font-semibold text-lg">{day.temp}°C</p>
                    <p className="text-blue-100 text-sm">{day.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  )
}

export default MainFeature