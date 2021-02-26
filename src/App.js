import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from './components/common/PrivateRoute';
import LoginComponent from './components/LoginComponent'
import MenuComponent from './components/MenuComponent';
import EnterLeavingComponent from './components/EnterLeavingComponent'
import EnterLeavingHistoryComponent from './components/EnterLeavingHistoryComponent';
import ErrorComponent from "./components/ErrorComponent";
import './App.css';

export const SomeRouter = () => {
  return (
    <Switch>
      <Route exact path={["/icos", "/icos/login"]} component={LoginComponent} />
      <PrivateRoute exact path="/icos/menu" component={MenuComponent} />
      <PrivateRoute exact path="/icos/enterLeaving" component={EnterLeavingComponent} />
      <PrivateRoute exact path="/icos/enterLeavingHistory" component={EnterLeavingHistoryComponent} />
      <PrivateRoute exact path="/icos/error" component={ErrorComponent} />
    </Switch>
  );
}

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <SomeRouter />
      </BrowserRouter>
    );
  }
}