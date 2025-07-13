import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleTask, deleteTask } from '../../store/taskSlice';

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
      opacity: task.completed ? 0.7 : 1,
      marginBottom: '15px'
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
          Completed
        </label>
      </div>
    </div>
  );
};

export default TaskItem;
