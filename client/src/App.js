import React, { Fragment } from 'react'; //ghost element that wont show up in dom
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import './App.css';

const App = () => 
  <Fragment>
    <Navbar />
    <Landing />
  </Fragment>

export default App;
