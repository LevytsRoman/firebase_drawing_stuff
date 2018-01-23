import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import Login from './components/users/login';

// import registerServiceWorker from './registerServiceWorker';
const Main = () => {
	return (
		<BrowserRouter>
			<div className="app">
				<Route exact path="/" component={App} />
				<Route exact path="/login" component={Login} />
			</div>
		</BrowserRouter>
	)
}
ReactDOM.render(<Main />, document.getElementById('root'));
// registerServiceWorker();
