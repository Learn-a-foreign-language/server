import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import PageLogin from './Login/Page.jsx';
import PageDashboard from './Dashboard/Page.jsx';

// Then we delete a bunch of code from App and
// add some <Link> elements...
const App = React.createClass({
  render() {
    return (
      <div>
        <h1>Learn a foreign language</h1>
        {this.props.children}
      </div>
    )
  }
})


function isLoggedIn(nextState, replaceState, callback){
    var isLoggedIn = true; // TODO, with promises
    if(!isLoggedIn){
      replaceState.to('/');
    }
    callback();
}



// Finally, we render a <Router> with some <Route>s.
// It does all the fancy routing stuff for us.
render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={PageLogin} />
      <Route onEnter={isLoggedIn} path="dashboard" component={PageDashboard} />
      // <Route path="dashboard" component={PageLogin} />
    </Route>
  </Router>
), document.getElementById('app'))