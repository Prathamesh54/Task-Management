import React, { useState } from 'react';
import Header from './Header';
import TaskForm from '../Tasks/TaskForm';
import TaskList from '../Tasks/TaskList';

const Dashboard = () => {
  const [editingTask, setEditingTask] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <Header />
      <TaskForm editingTask={editingTask} setEditingTask={setEditingTask} />
      <TaskList onEdit={setEditingTask} />
    </div>
  );
};

export default Dashboard;
