import React from 'react';
import { useSelector } from 'react-redux';
import TaskItem from './TaskItem';

const TaskList = ({ onEdit }) => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div style={{ marginTop: '20px' }}>
      {filteredTasks.length === 0 ? (
        <p style={{ color: '#666' }}>No tasks to display.</p>
      ) : (
        filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} onEdit={onEdit} />
        ))
      )}
    </div>
  );
};

export default TaskList;
