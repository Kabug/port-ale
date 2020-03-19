import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import "../styles/App.css";

import NavigationBar from "./NavigationBar";
import Upload from "./Upload";
import Users from "./Users";
import Email from "./Email";
import PortalOrders from "./PortalOrders";
import NotFound from "./NotFound";
import Export from "./Export";
import DeleteArchives from "./DeleteArchives";

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Switch>
          <Route path="/" exact component={PortalOrders}/>
          <Route path="/users" component={Users}/>
          <Route path="/upload" component={Upload}/>
          <Route path="/email" component={Email}/>
          <Route path="/export" component={Export}/>
          <Route path="/deletearchiveddata" component={DeleteArchives}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
