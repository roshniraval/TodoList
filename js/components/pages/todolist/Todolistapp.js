import React, { Component } from 'react';
import './App.css';
import { TodoForm, TodoList } from './components/todo';
import { addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos } from './lib/todoHelpers';
import { pipe, partial } from './lib/utils';
import { loadTodos, createTodo, saveTodo, deleteTodo } from './lib/todoService';

class Todolistapp extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      currentTodo: '',
	  updBtn: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmptySubmit = this.handleEmptySubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.showTempMessage = this.showTempMessage.bind(this);
	this.handleUpdate = this.handleUpdate.bind(this);
  }

  static contextTypes = {
    route: React.PropTypes.string
  }

  componentDidMount() {
    loadTodos()
      .then(todos => this.setState({todos}))
  }

  handleInputChange(e) {
    this.setState({
      currentTodo: e.target.value
    });	
  }

  handleSubmit(e) {
    e.preventDefault();
	console.log('todo added');
    const newId = generateId();
    const newTodo = { id: newId, name: this.state.currentTodo, isComplete: false };
    const updatedTodos = addTodo(this.state.todos, newTodo);
    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMessage: ''
    });
    createTodo(newTodo)
      .then(() => this.showTempMessage('Todo added'));
  }

  showTempMessage(msg) {
    this.setState({
      message: msg
    });
    setTimeout(() => this.setState({message: ''}), 1000);
  }

  handleEmptySubmit(e) {
    e.preventDefault();
    this.setState({
      errorMessage: 'Please enter a valid todo'
    });
  }

  handleToggle(id) {
	this.setState({
		updBtn: !this.state.updBtn
	}, function() {
		if (this.state.updBtn) {
			this.setState({
				currentTodo: updated.name,
				currentId: id
			});
		}
	});
    const getToggleTodo = pipe(findById, toggleTodo);
    const updated = getToggleTodo(id, this.state.todos);	
	
    const getUpdatedTodos = partial(updateTodo, this.state.todos);
    const updatedTodos = getUpdatedTodos(updated);
    this.setState({
      todos: updatedTodos
    });
    saveTodo(updated)
      .then(() => this.showTempMessage('Todo updated in the server'));
  }

  handleRemove(id, e) {
    e.preventDefault();
    const updatedTodos = removeTodo(this.state.todos, id);
    this.setState({
      todos: updatedTodos
    });
    deleteTodo(id)
      .then(() => this.showTempMessage('Todo removed from server'));
  }
  
  handleUpdate(e) {
	e.preventDefault();
	console.clear();
	const newArray = Array.from(this.state.todos);
	for (let i = 0; i < newArray.length; i++ ) {
		if (newArray[i]['id'] == this.state.currentId) {
			newArray[i]['name'] = this.state.currentTodo;
			newArray[i]['isComplete'] = false;
		}
	}	
	this.setState({
		todos: newArray,
		updBtn: !this.state.updBtn,
		currentTodo: ''
	})
  }

  render() {
    const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit;
    const displayTodos = filterTodos(this.state.todos, this.context.route);

    return (
      <div>
        <h1>Manage Todo list....</h1>
        {this.state.errorMessage && <p className="error">{this.state.errorMessage}</p>}
        {this.state.message && <p className="success">{this.state.message}</p>}
        <TodoForm
          handleInputChange={this.handleInputChange}
          currentTodo={this.state.currentTodo}
          handleSubmit={submitHandler}
		  handleUpdate={this.handleUpdate}
		  isUpdBtn = {this.state.updBtn}
        />
      <TodoList
        handleToggle={this.handleToggle}
        todos={displayTodos}
        handleRemove={this.handleRemove}		
      />
      </div>
    );
  }
}

export default Todolistapp;