import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock API base URL - replace with your actual backend URL
  const API_BASE = 'http://localhost:8000/api/Todo';

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Using mock data for demo.');
      // Mock data for demo purposes
     
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo,
          isCompleted: false
        }),
      });

      if (!response.ok) throw new Error('Failed to add todo');
      
      const newTodoItem = await response.json();
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    } catch (err) {
      // Mock add for demo
      const mockTodo = {
        id: Date.now(),
        title: newTodo,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, mockTodo]);
      setNewTodo('');
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          isCompleted: !todo.isCompleted
        }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      ));
    } catch (err) {
      // Mock toggle for demo
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      ));
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      // Mock delete for demo
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const completedCount = todos.filter(todo => todo.isCompleted).length;
  const totalCount = todos.length;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    card: {
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: 'none'
    },
    header: {
      color: '#333',
      fontWeight: 'bold',
      marginBottom: '2rem'
    },
    todoItem: {
      transition: 'all 0.3s ease',
      borderRadius: '10px',
      marginBottom: '10px',
      padding: '15px',
      border: '1px solid #e9ecef'
    },
    completedTodo: {
      backgroundColor: '#d4edda',
      borderColor: '#c3e6cb'
    },
    incompleteTodo: {
      backgroundColor: '#fff',
      borderColor: '#dee2e6'
    },
    checkButton: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      border: '2px solid #28a745',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    checkedButton: {
      backgroundColor: '#28a745',
      color: 'white'
    },
    todoText: {
      flex: 1,
      marginLeft: '15px',
      marginRight: '15px',
      fontSize: '16px'
    },
    completedText: {
      textDecoration: 'line-through',
      color: '#6c757d'
    },
    statsCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '20px'
    },
    deleteButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#dc3545',
      padding: '5px',
      borderRadius: '5px',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card" style={styles.card}>
              <div className="card-body p-4">
                <h1 className="text-center" style={styles.header}>
                  Todo App
                </h1>

                {error && (
                  <div className="alert alert-warning" role="alert">
                    <small>{error}</small>
                  </div>
                )}

                {/* Add Todo Form */}
                <div className="input-group mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Add a new todo..."
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={addTodo}
                      disabled={!newTodo.trim() || loading}
                    >
                      <Plus size={20} className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div style={styles.statsCard}>
                  <div className="row text-center">
                    <div className="col-4">
                      <strong>Total</strong><br />
                      <span className="text-primary">{totalCount}</span>
                    </div>
                    <div className="col-4">
                      <strong>Completed</strong><br />
                      <span className="text-success">{completedCount}</span>
                    </div>
                    <div className="col-4">
                      <strong>Remaining</strong><br />
                      <span className="text-warning">{totalCount - completedCount}</span>
                    </div>
                  </div>
                </div>

                {/* Todo List */}
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading todos...</p>
                  </div>
                ) : todos.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p>No todos yet. Add one above!</p>
                  </div>
                ) : (
                  <div>
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        style={{
                          ...styles.todoItem,
                          ...(todo.isCompleted ? styles.completedTodo : styles.incompleteTodo)
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            style={{
                              ...styles.checkButton,
                              ...(todo.isCompleted ? styles.checkedButton : {})
                            }}
                          >
                            {todo.isCompleted && <Check size={16} />}
                          </button>

                          <span
                            style={{
                              ...styles.todoText,
                              ...(todo.isCompleted ? styles.completedText : {})
                            }}
                          >
                            {todo.title}
                          </span>

                          <button
                            onClick={() => deleteTodo(todo.id)}
                            style={styles.deleteButton}
                            className="hover-effect"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#f8d7da';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;