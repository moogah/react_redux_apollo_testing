import React from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import reducer, {getGreeting, setGreeting, SET_GREETING} from './reduxStore';
import gql from 'graphql-tag';

// define two functions that tell our component how to interact with the redux store
const mapStateToProps = state => ({
  greeting: getGreeting(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators([getGreeting, setGreeting], dispatch)
});

class ReactWithRedux extends React.Component {
  render() {
    return (
      <h3>{this.props.greeting}</h3>
    );
  }
}

// create a "Container" component that manages the connection of our component
// and the functions that interface with redux
const ConnectedReactWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactWithRedux);

export default ConnectedReactWithRedux;