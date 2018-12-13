import React from 'react';

export default class ComponentWithProps extends React.Component {
  render() {
    return (
      <h3>{this.props.greeting}</h3>
    );
  }
}
