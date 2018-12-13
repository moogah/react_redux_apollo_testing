import React from 'react';
import PropTypes from 'prop-types';
import {Query} from 'react-apollo';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import reducer, {getGreeting, getNice, setGreeting, setNice, SET_GREETING} from './reduxStore';
import gql from 'graphql-tag';

// We don't define a getter for greeting this time, since it's not coming from the redux store
const mapStateToProps = state => ({
  beNice: getNice(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators([getGreeting, setGreeting, setNice], dispatch)
});

const GREETING_QUERY = gql`
  query($beNice: String) {
    GreetingQuery(beNice: $beNice) {
      greeting
    }
  }
`;

class ReactWithApollo extends React.Component {
  render() {
    if (this.props.GreetingQuery) {
      return (
        <h3>{this.props.GreetingQuery.greeting}</h3>
      );
    } else {
      return <h3></h3>
    }
  }
}

ReactWithApollo.propTypes = {
  GreetingQuery: PropTypes.shape({
    greeting: PropTypes.String
  })
};

// properly destructuring the props that get passed in here is important
// otherwise they will be sent to the graphql query as variables
const ReactWithApolloHoC = function(props) {
  return (
    <Query
      query={GREETING_QUERY}
      variables={{beNice: props.beNice}}
    >
      {({loading, error, data, fetchMore, refetch}) => {
        return (
          <ReactWithApollo
            {...props}
            {...data}
            {...error}
          />
        );
      }}
    </Query>
  );
}

// unlike before we now wrap our HoC in the connect function instead of 
// our component directly
const ConnectedReactWithApollo = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactWithApolloHoC);

export default ConnectedReactWithApollo;

export {GREETING_QUERY, ReactWithApolloHoC, ReactWithApollo}