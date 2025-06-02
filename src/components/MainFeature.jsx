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
      taskType: 'Maintenance',
      status: 'Not Started'
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
// Crops search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFarm, setFilterFarm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCropType, setFilterCropType] = useState('')
  const [sortBy, setSortBy] = useState('plantingDate')
  const [sortOrder, setSortOrder] = useState('desc')

// Tasks search and filter states
  const [taskSearchTerm, setTaskSearchTerm] = useState('')
  const [taskFilterFarm, setTaskFilterFarm] = useState('')
  const [taskFilterCrop, setTaskFilterCrop] = useState('')
  const [taskFilterPriority, setTaskFilterPriority] = useState('')
  const [taskFilterStatus, setTaskFilterStatus] = useState('')
  const [taskFilterType, setTaskFilterType] = useState('')
  const [taskSortBy, setTaskSortBy] = useState('dueDate')
  const [taskSortOrder, setTaskSortOrder] = useState('asc')
// Expenses search and filter states
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('')
  const [expenseFilterFarm, setExpenseFilterFarm] = useState('')
  const [expenseFilterCategory, setExpenseFilterCategory] = useState('')
  const [expenseFilterDateFrom, setExpenseFilterDateFrom] = useState('')
  const [expenseFilterDateTo, setExpenseFilterDateTo] = useState('')
  const [expenseFilterAmountMin, setExpenseFilterAmountMin] = useState('')
  const [expenseFilterAmountMax, setExpenseFilterAmountMax] = useState('')
  const [expenseSortBy, setExpenseSortBy] = useState('date')
  const [expenseSortOrder, setExpenseSortOrder] = useState('desc')
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
                <div>
                  <label htmlFor="farm-name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Farm Name
                  </label>
                  <input
                    id="farm-name"
                    type="text"
                    placeholder="Farm Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="farm-location" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Location
                  </label>
                  <input
                    id="farm-location"
                    type="text"
                    placeholder="Location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label htmlFor="farm-size" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Size
                    </label>
                    <input
                      id="farm-size"
                      type="number"
                      placeholder="Size"
                      value={formData.size || ''}
                      onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="farm-size-unit" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Unit
                    </label>
                    <select
                      id="farm-size-unit"
                      value={formData.sizeUnit || 'acres'}
                      onChange={(e) => setFormData({ ...formData, sizeUnit: e.target.value })}
                      className="input-field w-24"
                    >
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
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

const renderCrops = () => {

    // Get farm name for a crop
    const getFarmName = (farmId) => {
      const farm = farms.find(f => f.id === farmId)
      return farm ? farm.name : 'Unknown Farm'
    }

    // Filter and search crops
    const filteredCrops = crops.filter(crop => {
      const farmName = getFarmName(crop.farmId)
      const matchesSearch = searchTerm === '' || 
        crop.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (crop.notes && crop.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesFarm = filterFarm === '' || crop.farmId === filterFarm
      const matchesStatus = filterStatus === '' || crop.status === filterStatus
      const matchesCropType = filterCropType === '' || crop.cropType === filterCropType
      
      return matchesSearch && matchesFarm && matchesStatus && matchesCropType
    }).sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case 'cropType':
          aValue = a.cropType
          bValue = b.cropType
          break
        case 'plantingDate':
          aValue = new Date(a.plantingDate)
          bValue = new Date(b.plantingDate)
          break
        case 'expectedHarvestDate':
          aValue = new Date(a.expectedHarvestDate)
          bValue = new Date(b.expectedHarvestDate)
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a[sortBy]
          bValue = b[sortBy]
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    const cropTypes = ['Corn', 'Wheat', 'Soybeans', 'Rice', 'Potatoes', 'Tomatoes', 'Carrots', 'Lettuce', 'Onions', 'Peppers']
    const statusOptions = ['Planted', 'Growing', 'Harvested', 'Failed']

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Crop Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>Add Crop</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search crops, varieties, farms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Farm Filter */}
            <select
              value={filterFarm}
              onChange={(e) => setFilterFarm(e.target.value)}
              className="input-field"
            >
              <option value="">All Farms</option>
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Crop Type Filter */}
            <select
              value={filterCropType}
              onChange={(e) => setFilterCropType(e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              {cropTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto min-w-0"
            >
              <option value="plantingDate">Planting Date</option>
              <option value="expectedHarvestDate">Harvest Date</option>
              <option value="cropType">Crop Type</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <span className="text-sm">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-surface-600 dark:text-surface-400">
            {filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''} found
          </p>
          {(searchTerm || filterFarm || filterStatus || filterCropType) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterFarm('')
                setFilterStatus('')
                setFilterCropType('')
              }}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map(crop => (
            <div key={crop.id} className="farm-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                  <ApperIcon name="Wheat" className="h-6 w-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit('crop', crop)}
                    className="p-2 text-surface-600 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="Edit2" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('crop', crop.id)}
                    className="p-2 text-surface-600 hover:text-red-500 transition-colors"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-1">
                {crop.cropType}
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-2">{crop.variety}</p>
              <p className="text-sm text-surface-500 dark:text-surface-500 mb-3">
                {getFarmName(crop.farmId)}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Planted:</span>
                  <span className="text-surface-900 dark:text-surface-100">
                    {format(new Date(crop.plantingDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Expected Harvest:</span>
                  <span className="text-surface-900 dark:text-surface-100">
                    {format(new Date(crop.expectedHarvestDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  crop.status === 'Growing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  crop.status === 'Planted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  crop.status === 'Harvested' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {crop.status}
                </span>
              </div>
              
              {crop.notes && (
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-3 p-2 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  {crop.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Wheat" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No crops found
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              {searchTerm || filterFarm || filterStatus || filterCropType 
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first crop'
              }
            </p>
            {!(searchTerm || filterFarm || filterStatus || filterCropType) && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                Add Your First Crop
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Crop Modal */}
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
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
<h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
                  {editingItem ? 'Edit Crop' : 'Add New Crop'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="crop-farm" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Farm
                    </label>
                    <select
                      id="crop-farm"
                      value={formData.farmId || ''}
                      onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Farm</option>
                      {farms.map(farm => (
                        <option key={farm.id} value={farm.id}>{farm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="crop-type" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Crop Type
                    </label>
                    <select
                      id="crop-type"
                      value={formData.cropType || ''}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Crop Type</option>
                      {cropTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="crop-variety" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Variety
                    </label>
                    <input
                      id="crop-variety"
                      type="text"
                      placeholder="Variety"
                      value={formData.variety || ''}
                      onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="crop-planting-date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Planting Date
                    </label>
                    <input
                      id="crop-planting-date"
                      type="date"
                      value={formData.plantingDate ? format(new Date(formData.plantingDate), 'yyyy-MM-dd') : ''}
                      onChange={(e) => setFormData({ ...formData, plantingDate: new Date(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="crop-harvest-date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Expected Harvest Date
                    </label>
                    <input
                      id="crop-harvest-date"
                      type="date"
                      value={formData.expectedHarvestDate ? format(new Date(formData.expectedHarvestDate), 'yyyy-MM-dd') : ''}
                      onChange={(e) => setFormData({ ...formData, expectedHarvestDate: new Date(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="crop-status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      id="crop-status"
                      value={formData.status || 'Planted'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="crop-notes" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      id="crop-notes"
                      placeholder="Notes (optional)"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input-field h-20 resize-none"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => editingItem ? handleUpdate('crop') : handleAdd('crop')}
                    className="btn-primary flex-1"
                  >
                    {editingItem ? 'Update' : 'Add'} Crop
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
  }
const renderTasks = () => {
    // Get farm and crop names for a task
    const getFarmName = (farmId) => {
      const farm = farms.find(f => f.id === farmId)
      return farm ? farm.name : 'Unknown Farm'
    }

    const getCropName = (cropId) => {
      const crop = crops.find(c => c.id === cropId)
      return crop ? `${crop.cropType} (${crop.variety})` : 'No Crop Assigned'
    }

    // Filter and search tasks
    const filteredTasks = tasks.filter(task => {
      const farmName = getFarmName(task.farmId)
      const cropName = getCropName(task.cropId)
      const matchesSearch = taskSearchTerm === '' || 
        task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        farmName.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        cropName.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        task.taskType.toLowerCase().includes(taskSearchTerm.toLowerCase())
      
      const matchesFarm = taskFilterFarm === '' || task.farmId === taskFilterFarm
      const matchesCrop = taskFilterCrop === '' || task.cropId === taskFilterCrop
      const matchesPriority = taskFilterPriority === '' || task.priority === taskFilterPriority
      const matchesStatus = taskFilterStatus === '' || 
        (taskFilterStatus === 'completed' && task.completed) ||
        (taskFilterStatus === 'pending' && !task.completed)
      const matchesType = taskFilterType === '' || task.taskType === taskFilterType
      
      return matchesSearch && matchesFarm && matchesCrop && matchesPriority && matchesStatus && matchesType
    }).sort((a, b) => {
      let aValue, bValue
      switch (taskSortBy) {
        case 'dueDate':
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
          break
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'completed':
          aValue = a.completed ? 1 : 0
          bValue = b.completed ? 1 : 0
          break
        default:
          aValue = a[taskSortBy]
          bValue = b[taskSortBy]
      }
      
      if (taskSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

const priorityOptions = ['Low', 'Medium', 'High']
    const taskTypes = ['Planting', 'Watering', 'Fertilizing', 'Pest Control', 'Harvesting', 'Maintenance', 'Monitoring', 'Other']
    const statusOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold']
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Task Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search tasks, farms, crops..."
                  value={taskSearchTerm}
                  onChange={(e) => setTaskSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Farm Filter */}
            <select
              value={taskFilterFarm}
              onChange={(e) => setTaskFilterFarm(e.target.value)}
              className="input-field"
            >
              <option value="">All Farms</option>
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>

            {/* Crop Filter */}
            <select
              value={taskFilterCrop}
              onChange={(e) => setTaskFilterCrop(e.target.value)}
              className="input-field"
            >
              <option value="">All Crops</option>
              {crops.map(crop => (
                <option key={crop.id} value={crop.id}>{crop.cropType} ({crop.variety})</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={taskFilterPriority}
              onChange={(e) => setTaskFilterPriority(e.target.value)}
              className="input-field"
            >
              <option value="">All Priorities</option>
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={taskFilterStatus}
              onChange={(e) => setTaskFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Second row of filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* Task Type Filter */}
            <select
              value={taskFilterType}
              onChange={(e) => setTaskFilterType(e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              {taskTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={taskSortBy}
              onChange={(e) => setTaskSortBy(e.target.value)}
              className="input-field"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="completed">Status</option>
            </select>

            <button
              onClick={() => setTaskSortOrder(taskSortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <span className="text-sm">{taskSortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              <ApperIcon name={taskSortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-surface-600 dark:text-surface-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
          </p>
          {(taskSearchTerm || taskFilterFarm || taskFilterCrop || taskFilterPriority || taskFilterStatus || taskFilterType) && (
            <button
              onClick={() => {
                setTaskSearchTerm('')
                setTaskFilterFarm('')
                setTaskFilterCrop('')
                setTaskFilterPriority('')
                setTaskFilterStatus('')
                setTaskFilterType('')
              }}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <div key={task.id} className={`farm-card p-6 ${task.completed ? 'opacity-75' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  task.priority === 'High' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                  task.priority === 'Medium' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                  'bg-gradient-to-br from-green-500 to-green-600'
                }`}>
                  <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-primary border-primary text-white'
                        : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                    }`}
                  >
                    {task.completed && <ApperIcon name="Check" className="h-3 w-3" />}
                  </button>
                  <button
                    onClick={() => handleEdit('task', task)}
                    className="p-1 text-surface-600 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="Edit2" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('task', task.id)}
                    className="p-1 text-surface-600 hover:text-red-500 transition-colors"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                task.completed 
                  ? 'line-through text-surface-500 dark:text-surface-500' 
                  : 'text-surface-900 dark:text-surface-100'
              }`}>
                {task.title}
              </h3>
              
              <p className="text-surface-600 dark:text-surface-400 mb-3 text-sm">
                {task.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Farm:</span>
                  <span className="text-surface-900 dark:text-surface-100">
                    {getFarmName(task.farmId)}
                  </span>
                </div>
                {task.cropId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Crop:</span>
                    <span className="text-surface-900 dark:text-surface-100">
                      {getCropName(task.cropId)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Due:</span>
                  <span className={`font-medium ${
                    new Date(task.dueDate) < new Date() && !task.completed
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-surface-900 dark:text-surface-100'
                  }`}>
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Type:</span>
                  <span className="text-surface-900 dark:text-surface-100">
                    {task.taskType}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {task.priority}
                </span>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.completed 
                    ? 'bg-primary/20 text-primary dark:bg-primary/30' 
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="CheckSquare" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No tasks found
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              {taskSearchTerm || taskFilterFarm || taskFilterCrop || taskFilterPriority || taskFilterStatus || taskFilterType
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first task'
              }
            </p>
            {!(taskSearchTerm || taskFilterFarm || taskFilterCrop || taskFilterPriority || taskFilterStatus || taskFilterType) && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                Add Your First Task
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Task Modal */}
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
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
<h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
                  {editingItem ? 'Edit Task' : 'Add New Task'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="task-title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Task Title
                    </label>
                    <input
                      id="task-title"
                      type="text"
                      placeholder="Task Title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="task-description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="task-description"
                      placeholder="Task Description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field h-20 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="task-farm" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Farm
                    </label>
                    <select
                      id="task-farm"
                      value={formData.farmId || ''}
                      onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Farm</option>
                      {farms.map(farm => (
                        <option key={farm.id} value={farm.id}>{farm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="task-crop" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Crop (Optional)
                    </label>
                    <select
                      id="task-crop"
                      value={formData.cropId || ''}
                      onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Crop (Optional)</option>
                      {crops.filter(crop => !formData.farmId || crop.farmId === formData.farmId).map(crop => (
                        <option key={crop.id} value={crop.id}>{crop.cropType} ({crop.variety})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="task-due-date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date
                    </label>
                    <input
                      id="task-due-date"
                      type="date"
                      value={formData.dueDate ? format(new Date(formData.dueDate), 'yyyy-MM-dd') : ''}
                      onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="task-priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      id="task-priority"
                      value={formData.priority || 'Medium'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="input-field"
                    >
                      {priorityOptions.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="task-type" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Task Type
                    </label>
                    <select
                      id="task-type"
                      value={formData.taskType || 'Other'}
                      onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                      className="input-field"
                    >
                      {taskTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
</select>
                  </div>
                  
                  <div>
                    <label htmlFor="task-status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      id="task-status"
                      value={formData.status || 'Not Started'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  {editingItem && (
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="task-completed"
                        checked={formData.completed || false}
                        onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                        className="w-4 h-4 text-primary bg-surface-100 border-surface-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <label htmlFor="task-completed" className="text-surface-900 dark:text-surface-100">
                        Mark as completed
                      </label>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => editingItem ? handleUpdate('task') : handleAdd('task')}
                    className="btn-primary flex-1"
                  >
                    {editingItem ? 'Update' : 'Add'} Task
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
  }
const renderExpenses = () => {
    // Get farm name for an expense
    const getFarmName = (farmId) => {
      const farm = farms.find(f => f.id === farmId)
      return farm ? farm.name : 'Unknown Farm'
    }

    // Filter and search expenses
    const filteredExpenses = expenses.filter(expense => {
      const farmName = getFarmName(expense.farmId)
      const matchesSearch = expenseSearchTerm === '' || 
        expense.description.toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
        farmName.toLowerCase().includes(expenseSearchTerm.toLowerCase())
      
      const matchesFarm = expenseFilterFarm === '' || expense.farmId === expenseFilterFarm
      const matchesCategory = expenseFilterCategory === '' || expense.category === expenseFilterCategory
      
      const expenseDate = new Date(expense.date)
      const matchesDateFrom = expenseFilterDateFrom === '' || expenseDate >= new Date(expenseFilterDateFrom)
      const matchesDateTo = expenseFilterDateTo === '' || expenseDate <= new Date(expenseFilterDateTo)
      
      const matchesAmountMin = expenseFilterAmountMin === '' || expense.amount >= parseFloat(expenseFilterAmountMin)
      const matchesAmountMax = expenseFilterAmountMax === '' || expense.amount <= parseFloat(expenseFilterAmountMax)
      
      return matchesSearch && matchesFarm && matchesCategory && matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax
    }).sort((a, b) => {
      let aValue, bValue
      switch (expenseSortBy) {
        case 'date':
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'category':
          aValue = a.category
          bValue = b.category
          break
        case 'description':
          aValue = a.description
          bValue = b.description
          break
        default:
          aValue = a[expenseSortBy]
          bValue = b[expenseSortBy]
      }
      
      if (expenseSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    const expenseCategories = ['Seeds', 'Fertilizer', 'Pesticides', 'Equipment', 'Fuel', 'Labor', 'Water', 'Maintenance', 'Insurance', 'Land Rent', 'Storage', 'Transportation', 'Marketing', 'Other']

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Expense Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search expenses, categories, farms..."
                  value={expenseSearchTerm}
                  onChange={(e) => setExpenseSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Farm Filter */}
            <select
              value={expenseFilterFarm}
              onChange={(e) => setExpenseFilterFarm(e.target.value)}
              className="input-field"
            >
              <option value="">All Farms</option>
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={expenseFilterCategory}
              onChange={(e) => setExpenseFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Second row of filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">From Date</label>
              <input
                type="date"
                value={expenseFilterDateFrom}
                onChange={(e) => setExpenseFilterDateFrom(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">To Date</label>
              <input
                type="date"
                value={expenseFilterDateTo}
                onChange={(e) => setExpenseFilterDateTo(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Amount Min */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Min Amount</label>
              <input
                type="number"
                placeholder="0"
                value={expenseFilterAmountMin}
                onChange={(e) => setExpenseFilterAmountMin(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Amount Max */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Max Amount</label>
              <input
                type="number"
                placeholder="1000"
                value={expenseFilterAmountMax}
                onChange={(e) => setExpenseFilterAmountMax(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Sort by:</span>
            <select
              value={expenseSortBy}
              onChange={(e) => setExpenseSortBy(e.target.value)}
              className="input-field w-auto min-w-0"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
              <option value="description">Description</option>
            </select>
            <button
              onClick={() => setExpenseSortOrder(expenseSortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <span className="text-sm">{expenseSortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              <ApperIcon name={expenseSortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Results Count and Total */}
        <div className="flex items-center justify-between">
          <p className="text-surface-600 dark:text-surface-400">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
            {filteredExpenses.length > 0 && (
              <span className="ml-2 font-semibold">
                (Total: ${filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)})
              </span>
            )}
          </p>
          {(expenseSearchTerm || expenseFilterFarm || expenseFilterCategory || expenseFilterDateFrom || expenseFilterDateTo || expenseFilterAmountMin || expenseFilterAmountMax) && (
            <button
              onClick={() => {
                setExpenseSearchTerm('')
                setExpenseFilterFarm('')
                setExpenseFilterCategory('')
                setExpenseFilterDateFrom('')
                setExpenseFilterDateTo('')
                setExpenseFilterAmountMin('')
                setExpenseFilterAmountMax('')
              }}
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Expenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit('expense', expense)}
                    className="p-2 text-surface-600 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="Edit2" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('expense', expense.id)}
                    className="p-2 text-surface-600 hover:text-red-500 transition-colors"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-1">
                  ${expense.amount.toFixed(2)}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-2">{expense.description}</p>
                <p className="text-sm text-surface-500 dark:text-surface-500">
                  {getFarmName(expense.farmId)}
                </p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Category:</span>
                  <span className="text-surface-900 dark:text-surface-100">{expense.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Date:</span>
                  <span className="text-surface-900 dark:text-surface-100">
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  expense.category === 'Seeds' || expense.category === 'Fertilizer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  expense.category === 'Equipment' || expense.category === 'Maintenance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  expense.category === 'Labor' || expense.category === 'Fuel' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-surface-100 text-surface-800 dark:bg-surface-900 dark:text-surface-200'
                }`}>
                  {expense.category}
                </span>
                {expense.receipt && (
                  <ApperIcon name="Paperclip" className="h-4 w-4 text-surface-400" title="Receipt attached" />
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="DollarSign" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No expenses found
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              {expenseSearchTerm || expenseFilterFarm || expenseFilterCategory || expenseFilterDateFrom || expenseFilterDateTo || expenseFilterAmountMin || expenseFilterAmountMax
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first expense'
              }
            </p>
            {!(expenseSearchTerm || expenseFilterFarm || expenseFilterCategory || expenseFilterDateFrom || expenseFilterDateTo || expenseFilterAmountMin || expenseFilterAmountMax) && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                Add Your First Expense
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Expense Modal */}
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
                className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
<h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
                  {editingItem ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="expense-farm" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Farm
                    </label>
                    <select
                      id="expense-farm"
                      value={formData.farmId || ''}
                      onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Farm</option>
                      {farms.map(farm => (
                        <option key={farm.id} value={farm.id}>{farm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="expense-amount" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Amount
                    </label>
                    <input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expense-category" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Category
                    </label>
                    <select
                      id="expense-category"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      {expenseCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="expense-description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <input
                      id="expense-description"
                      type="text"
                      placeholder="Description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expense-date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Date
                    </label>
                    <input
                      id="expense-date"
                      type="date"
                      value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''}
                      onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expense-receipt" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Receipt/Reference (optional)
                    </label>
                    <input
                      id="expense-receipt"
                      type="text"
                      placeholder="Receipt/Reference (optional)"
                      value={formData.receipt || ''}
                      onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => editingItem ? handleUpdate('expense') : handleAdd('expense')}
                    className="btn-primary flex-1"
                  >
                    {editingItem ? 'Update' : 'Add'} Expense
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
}

  const renderReports = () => {
    const profitLossData = calculateProfitLoss(reportDateFrom, reportDateTo, reportFarmFilter)
    const expenseChartData = getExpenseChartData(profitLossData.expenseByCategory)
    const profitTrendData = getProfitTrendData()

    const exportReport = () => {
      const reportData = {
        period: `${format(new Date(reportDateFrom), 'MMM dd, yyyy')} - ${format(new Date(reportDateTo), 'MMM dd, yyyy')}`,
        farm: reportFarmFilter ? farms.find(f => f.id === reportFarmFilter)?.name : 'All Farms',
        summary: profitLossData,
        generatedAt: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `profit-loss-report-${format(new Date(), 'yyyy-MM-dd')}.json`
      link.click()
      URL.revokeObjectURL(url)
      
      toast.success('Report exported successfully!')
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Profit & Loss Reports</h2>
          <button
            onClick={exportReport}
            className="export-btn flex items-center space-x-2"
          >
            <ApperIcon name="Download" className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">From Date</label>
              <input
                type="date"
                value={reportDateFrom}
                onChange={(e) => setReportDateFrom(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">To Date</label>
              <input
                type="date"
                value={reportDateTo}
                onChange={(e) => setReportDateTo(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Farm</label>
              <select
                value={reportFarmFilter}
                onChange={(e) => setReportFarmFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Farms</option>
                {farms.map(farm => (
                  <option key={farm.id} value={farm.id}>{farm.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="input-field"
              >
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
                <option value="trends">Trends</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="report-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Revenue</h3>
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              ${profitLossData.totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="report-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Expenses</h3>
              <ApperIcon name="TrendingDown" className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              ${profitLossData.totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="report-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400">Net Profit</h3>
              <ApperIcon name={profitLossData.netProfit >= 0 ? "TrendingUp" : "TrendingDown"} 
                className={`h-5 w-5 ${profitLossData.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className={`text-2xl font-bold ${profitLossData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profitLossData.netProfit.toFixed(2)}
            </p>
          </div>

          <div className="report-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400">Profit Margin</h3>
              <ApperIcon name="Percent" className="h-5 w-5 text-blue-500" />
            </div>
            <p className={`text-2xl font-bold ${profitLossData.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitLossData.profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown Chart */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Expense Breakdown
            </h3>
            {Object.keys(profitLossData.expenseByCategory).length > 0 ? (
              <Chart
                options={expenseChartData.options}
                series={expenseChartData.series}
                type="pie"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-surface-500">
                No expense data for selected period
              </div>
            )}
          </div>

          {/* Profit Trend Chart */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              6-Month Profit Trend
            </h3>
            <Chart
              options={profitTrendData.options}
              series={profitTrendData.series}
              type="line"
              height={350}
            />
          </div>
        </div>

        {/* Detailed Tables */}
        {reportType === 'detailed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Details */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Expense Details
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {profitLossData.filteredExpenses.map(expense => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-100">{expense.description}</p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {expense.category} • {format(new Date(expense.date), 'MMM dd')}
                      </p>
                    </div>
                    <span className="font-semibold text-red-600">${expense.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Details */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Revenue Details
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {profitLossData.filteredRevenue.map(rev => (
                  <div key={rev.id} className="flex justify-between items-center p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                    <div>
                      <p className="font-medium text-surface-900 dark:text-surface-100">{rev.cropType}</p>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        {rev.yieldAmount} {rev.yieldUnit} @ ${rev.pricePerUnit}/{rev.yieldUnit} • {format(new Date(rev.harvestDate), 'MMM dd')}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">${rev.totalRevenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Farm Comparison */}
        {reportType === 'trends' && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Farm Performance Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {farms.map(farm => {
                const farmData = calculateProfitLoss(reportDateFrom, reportDateTo, farm.id)
                return (
                  <div key={farm.id} className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">{farm.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-surface-600 dark:text-surface-400">Revenue:</span>
                        <span className="text-green-600 font-medium">${farmData.totalRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-surface-600 dark:text-surface-400">Expenses:</span>
                        <span className="text-red-600 font-medium">${farmData.totalExpenses.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-surface-200 dark:border-surface-600 pt-2">
                        <span className="text-surface-900 dark:text-surface-100 font-medium">Net Profit:</span>
                        <span className={`font-semibold ${farmData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${farmData.netProfit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'farms':
        return renderFarms()
      case 'crops':
        return renderCrops()
      case 'tasks':
        return renderTasks()
      case 'expenses':
        return renderExpenses()
      case 'reports':
        return renderReports()
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