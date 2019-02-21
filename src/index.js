import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App accesstoken={document.getElementById('token')? document.getElementById('token').value : undefined }/>, document.getElementById('root'));
registerServiceWorker();
