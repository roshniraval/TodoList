// Import all the third party stuff
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { homeReducer } from './reducers/reducers';
import FontFaceObserver from 'fontfaceobserver';

// When Open Sans is loaded, add the js-open-sans-loaded class to the body
// which swaps out the fonts
const openSansObserver = new FontFaceObserver('Open Sans');

openSansObserver.check().then(() => {
  document.body.classList.add('js-open-sans-loaded');
}, (err) => {
  document.body.classList.remove('js-open-sans-loaded');
});

// Import the components used as pages
import HomePage from './components/pages/HomePage.react';
import LoginPage from './components/pages/LoginPage.react';
import RegisterPage from './components/pages/RegisterPage.react';
import Dashboard from './components/pages/Dashboard.react';
import Todolistapp from './components/pages/todolist/Todolistapp';
import NotFound from './components/pages/NotFound.react';
import App from './components/App.react';

// Import the CSS file, which webpack transfers to the build folder
import '../css/main.css';

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(homeReducer);


function checkAuth(nextState, replaceState) {
  let { loggedIn } = store.getState();
	 console.log(nextState.location.pathname)

   console.log("JMD")
  
	if(nextState.location.pathname == '/todolist'){
		  if (!loggedIn) {
			  console.log(nextState.location.pathname)
			  replaceState(null, '/');
		  }	
		  
 }	else if (nextState.location.pathname !== '/dashboard') {
    if (loggedIn) {
      if (nextState.location.state && nextState.location.pathname) {
        replaceState(null, nextState.location.pathname);
      } else {
        replaceState(null, '/');
      }
    }
  } else {
    // If the user is already logged in, forward them to the homepage
    if (!loggedIn) {
      if (nextState.location.state && nextState.location.pathname) {
        replaceState(null, nextState.location.pathname);
      } else {
        replaceState(null, '/');
      }
    }
  }
}

// Mostly boilerplate, except for the Routes. These are the pages you can go to,
// which are all wrapped in the App component, which contains the navigation etc
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route path="/" component={HomePage} />
        <Route onEnter={checkAuth}>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/dashboard" component={Dashboard} />
		  <Route path="/todolist" component={Todolistapp} />
        </Route>
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
