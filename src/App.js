import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard"
import Adminpage from './components/Adminpage/Adminpage';
import InvestmentComponent from './components/investment/investment';
import Register from "./components/LogIn/Register.js";
import LogIn from './components/LogIn/LogIn.js';

import "./components/Adminpage.css";
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <LogIn/>
        </Route>
        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/client">
          <InvestmentComponent/>
        </Route>
        <Route path="/admin">
          <Adminpage data =""/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
