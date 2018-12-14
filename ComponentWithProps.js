import React from 'react';

const InternalComponent = function() {
  return (
    <h4>This won't get rendered</h4>
  )
}

export default class ComponentWithProps extends React.Component {
  render() {
    return (
      <div>
        <h3>{this.props.greeting}</h3>
        <InternalComponent greeting={this.props.greeting}/>
      </div>
    );
  }
}

export {InternalComponent}
