import React from 'react';
import { Switch, Route } from "react-router-dom";

import Home from '../components/Home';
import Consents from '../components/Consents';

function Main(props){
  return (
    <Switch>
      <Route path="/consents">
        <Consents />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

export default Main;
