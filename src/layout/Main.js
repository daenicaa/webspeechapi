import { Switch, Route } from "react-router-dom";

import Home from '../components/Home';
import Consents from '../components/Consents';

function Main(props){
  return (
    <Switch>
      <Route path="/consents">
        <div className="container">
          <Consents />
        </div>
      </Route>
      <Route path="/">
        <div className="container">
          <Home />
        </div>
      </Route>
    </Switch>
  )
}

export default Main;
