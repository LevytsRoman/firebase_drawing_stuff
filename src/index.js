import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
const Main = () => {
	return (
		<BrowserRouter>
			<div className="app">
				<Route exact path="/" component={App} />
			</div>
		</BrowserRouter>
	)
}
ReactDOM.render(<Main />, document.getElementById('root'));
// registerServiceWorker();
