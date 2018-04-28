import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Cabanas from './components/cabanas';
import CabanasMap from './components/cabanas-map';
import CabanasResources from './components/cabanas-resources';


class App extends Component {
  render() {
    return (
      <div className="App">
       <Route exact path='/' render={() => (
           <Cabanas/>
        )}/>
       <Route exact path='/resources' render={() => (
            <CabanasResources />
        )}/>
        <Route exact path='/map' render={() => (
            <CabanasMap />
        )}/>
      </div>
    );
  }
}

export default App;
