SimpleReactComponent
The simplest "Hello World" of react testing actually is rather complicated.
It requires:
- jest config
- babel and plugins (https://stackoverflow.com/questions/48137486/jest-enzyme-shallow-unexpected-token)
https://github.com/lelandrichardson/enzyme-example-jest/blob/master/.babelrc
https://github.com/airbnb/babel-preset-airbnb
https://github.com/vuejs/vue-cli/issues/2432
- enzyme test helper

ReactReduxComponent
Where before we assigned properties to a react component when and where we wrote their tags, now we're going to use Redux for managing that process.  There a number of reasons why redux is a better design pattern and no shortage of blogs on the internet to read if you want to know more about why :)

A short explanation of redux is that it provides us with a javascript object that contains all the data in our application along with a set of functions for setting and retreiving these values.  Unlike a class that has get() and set() methods however, we interact with redux by passing "actions" into a "reducer".

An action is simply a js object that has a `type` property and then some additional properties which we can define.  ie:
```
actionDefinition = {
  type: 'MY_ACTION_ID',
  greeting: 'Howdy'
}
```
only the `type` value is needed and it's value is essentially arbitrary, but that value needs to be consistently used to identify any particular action.

When we pass an action object into the reducer it will know how to check the type property and then perform some function on the addional data that is sent in, combining these new properties with the existing state object and passing back a new state object as a result.  ie:
```
state = {
  title: 'El Capitan',
  name: 'George'
}

action = {
  type: 'CHANGE_NAME',
  name: 'Fred'
}

function reducer(state, action) {
  if (action.type == 'CHANGE_NAME') {
    // ...state means we will return all state properties not specifially named
    return {...state, name: action.name}
  }
}
```

if we pass `action` and `state` to `reducer()` we will get back a new state object:
```
{
  title: 'El Capitan',
  name: 'Fred'
}
```

Unit testing redux is typically simple; actions, selectors and the reducer are simple functions and no additional design patterns are necessary.

ReactComponents that are connected to a Redux store however start to become more complicated to test.  The first wrinkle is that we don't want to set properties directly on our components because that may not ensure we've tested how logic in our selectors and reducer affect the properties that get passed in.

This means that when we use Enzyme to render our components the shallow() option isn't sufficient.  Shallow rendering will only actually render the first component found in the tree, and in this case that will be a <Provider>, we will not get to test the properties of our actual component much less see its rendered output.

Further complicating this is the need to wrap our React component in a "Container" class.  This is simply another react component that we pass to a special connect() function of the react-redux library and takes in a set of functions we've define that allow our component to interface with the redux store.