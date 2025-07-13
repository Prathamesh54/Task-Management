import { createSlice } from '@reduxjs/toolkit';

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

export const { addTask, toggleTask, deleteTask, updateTask, setFilter, loadTasks } = tasksSlice.actions;
export default tasksSlice.reducer;