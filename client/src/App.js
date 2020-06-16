import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { Login, Home } from './pages';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={'/login'} exact component={Login} />
        <PrivateRoute path="/" exact component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
