import React, { Component } from 'react';
import LotteryList from './LotteryList';

class Featured extends React.Component {
  render() {
    return (
      <LotteryList {...this.props} />
    );
  }
}

module.exports = Featured;
