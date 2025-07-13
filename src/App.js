import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    users: [] // Simulated user database
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    register: (state, action) => {
      state.users.push(action.payload);
    },
    loadUsers: (state, action) => {
      state.users = action.payload;
    }
  }
});

// Tasks Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    filter: 'all' // all, completed, pending
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description,
        completed: false,
        priority: action.payload.priority || 'medium',
        createdAt: new Date().toISOString(),
        userId: action.payload.userId
      });
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    loadTasks: (state, action) => {
      state.tasks = action.payload;
    }
  }
});

// Store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tasks: tasksSlice.reducer
  }
});

// Action creators
const { login, logout, register, loadUsers } = authSlice.actions;
const { addTask, toggleTask, deleteTask, updateTask, setFilter, loadTasks } = tasksSlice.actions;

// Login Component
const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if user exists
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    if (user) {
      dispatch(login(user));
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      setErrors({ general: 'Invalid email or password' });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errors.general && (
          <div style={{ color: '#e74c3c', padding: '10px', backgroundColor: '#fdf2f2', borderRadius: '5px' }}>
            {errors.general}
          </div>
        )}
        
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.email ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.email && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.email}</div>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.password ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.password && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.password}</div>}
        </div>

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Login
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Don't have an account?{' '}
        <span
          onClick={onSwitchToRegister}
          style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

// Register Component
const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Check if user already exists
    if (users.find(u => u.email === formData.email)) {
      newErrors.email = 'User with this email already exists';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    dispatch(register(newUser));
    
    // Save to localStorage
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    onSwitchToLogin();
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.name ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.name && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.name}</div>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.email ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.email && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.email}</div>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.password ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.password && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.password}</div>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.confirmPassword ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.confirmPassword && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.confirmPassword}</div>}
        </div>

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#27ae60'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2ecc71'}
        >
          Register
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Already have an account?{' '}
        <span
          onClick={onSwitchToLogin}
          style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

// Header Component
const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('currentUser');
  };

  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>Task Manager</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span>Welcome, {user?.name}!</span>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

// Task Form Component
const TaskForm = ({ onClose, editingTask }) => {
  const [formData, setFormData] = useState({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    priority: editingTask?.priority || 'medium'
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingTask) {
      dispatch(updateTask({ ...editingTask, ...formData }));
    } else {
      dispatch(addTask({ ...formData, userId: user.id }));
    }
    
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.title ? '2px solid #e74c3c' : '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
            {errors.title && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.title}</div>}
          </div>

          <div>
            <textarea
              placeholder="Task Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.description ? '2px solid #e74c3c' : '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
            {errors.description && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.description}</div>}
          </div>

          <div>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {editingTask ? 'Update' : 'Add'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Task Item Component
const TaskItem = ({ task, onEdit }) => {
  const dispatch = useDispatch();

  const priorityColors = {
    low: '#95a5a6',
    medium: '#f39c12',
    high: '#e74c3c'
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: `3px solid ${priorityColors[task.priority]}`,
      opacity: task.completed ? 0.7 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <h3 style={{
          margin: 0,
          color: '#333',
          textDecoration: task.completed ? 'line-through' : 'none'
        }}>
          {task.title}
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onEdit(task)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => dispatch(deleteTask(task.id))}
            style={{
              padding: '5px 10px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
        </div>
      </div>
      
      <p style={{
        margin: '10px 0',
        color: '#666',
        textDecoration: task.completed ? 'line-through' : 'none'
      }}>
        {task.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          padding: '4px 8px',
          backgroundColor: priorityColors[task.priority],
          color: 'white',
          borderRadius: '12px',
          fontSize: '12px',
          textTransform: 'capitalize'
        }}>
          {task.priority} Priority
        </span>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => dispatch(toggleTask(task.id))}
            style={{ transform: 'scale(1.2)' }}
          />
          <span style={{ color: task.completed ? '#27ae60' : '#666' }}>
            {task.completed ? 'Completed' : 'Mark as Complete'}
          </span>
        </label>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);

  // Filter tasks for current user
  const userTasks = tasks.filter(task => task.userId === user.id);
  
  const filteredTasks = userTasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const taskStats = {
    total: userTasks.length,
    completed: userTasks.filter(t => t.completed).length,
    pending: userTasks.filter(t => !t.completed).length
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Total Tasks</h3>
          <p style={{ fontSize: '28px', margin: 0, fontWeight: 'bold' }}>{taskStats.total}</p>
        </div>
        <div style={{
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Completed</h3>
          <p style={{ fontSize: '28px', margin: 0, fontWeight: 'bold' }}>{taskStats.completed}</p>
        </div>
        <div style={{
          backgroundColor: '#f39c12',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Pending</h3>
          <p style={{ fontSize: '28px', margin: 0, fontWeight: 'bold' }}>{taskStats.pending}</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => dispatch(setFilter('all'))}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'all' ? '#3498db' : '#ecf0f1',
              color: filter === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          <button
            onClick={() => dispatch(setFilter('pending'))}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'pending' ? '#f39c12' : '#ecf0f1',
              color: filter === 'pending' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Pending
          </button>
          <button
            onClick={() => dispatch(setFilter('completed'))}
            style={{
              padding: '10px 20px',
              backgroundColor: filter === 'completed' ? '#27ae60' : '#ecf0f1',
              color: filter === 'completed' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Completed
          </button>
        </div>

        <button
          onClick={() => setShowTaskForm(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + Add New Task
        </button>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3>No tasks found</h3>
          <p>Get started by adding your first task!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm onClose={handleCloseForm} editingTask={editingTask} />
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [authMode, setAuthMode] = useState('login');
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Load data from localStorage on app start
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    const savedTasks = localStorage.getItem('tasks');
    const savedUser = localStorage.getItem('currentUser');

    if (savedUsers) {
      dispatch(loadUsers(JSON.parse(savedUsers)));
    }

    if (savedTasks) {
      dispatch(loadTasks(JSON.parse(savedTasks)));
    }

    if (savedUser) {
      dispatch(login(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  // Save tasks to localStorage whenever tasks change
  const tasks = useSelector(state => state.tasks.tasks);
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      <Dashboard />
    </div>
  );
};

// Export the App wrapped with Redux Provider
export default function TaskManagementApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}