import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import "../styles/App.css";

import NavigationBar from "./NavigationBar";
import About from "./About";
import Email from "./Email";
import PortalOrders from "./PortalOrders";
import NotFound from "./NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Switch>
          <Route path="/" exact component={PortalOrders}/>
          <Route path="/about" component={About}/>
          <Route path="/email" component={Email}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
