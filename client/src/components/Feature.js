import React, { Component } from 'react';
import requireAuth from './requireAuth';

class Feature extends Component {
  render () {
    return (
      <div>Oh! So you are signed In.</div>
    );
  }
}

export default requireAuth(Feature);