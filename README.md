# Basic Setup
The simplest "Hello World" of testing in react requires a bit of setup to get going.  Beyond the obvious installation of Node/NPM and Jest we will also need to install a transpiling toolset called babel along with a series of plugins and presets for babel that will allow Jest to understand the special syntax involved in writing React components.


#### Requirements:
*jest.config.js*

For this project we're going to use the default settings for jest.  This means it will recognize any file ending with .test.js as a test file.

The only thing special we need to do is provide jest with a setupFile that will handle some boilerplate needed for Enzyme.

*babel, plugins, presets and .babelrc*

Here we rely on npm install to get all the plugins needed.  Unfortunalty I've not found any one reference that explains exactly what you need, so for now all we can do is reference our existing and working `package.lock` files.  

Once we've installed all these plugins and presets, we need to create a `.babelrc` and specify the plugins and presets we're using.  

If you're interested in researching this further, here are some places to start:

https://stackoverflow.com/questions/48137486/jest-enzyme-shallow-unexpected-token
https://github.com/lelandrichardson/enzyme-example-jest/blob/master/.babelrc
https://github.com/airbnb/babel-preset-airbnb
https://github.com/vuejs/vue-cli/issues/2432

*enzyme test helper*

This is a simple javascript file that sets up the Adapters needed by Enzyme.  We could just include this in the test files that actually use Enzyme, but for this project it isn't necessary.

# SimpleReactComponent
Let's start with the easiest possible example so we can focus on what the Enzyme framework does and what we can do with its API.

The component itself is bog standard and only returns some static HTML.  I'll leave a detailed explanation of React components to some other tutorial.

Instead let's focus on Enzyme.  The best reference material I've found for it are the API docs in their github repo https://github.com/airbnb/enzyme/tree/master/docs/api/ShallowWrapper.  It lacks in narrative a bit, but provides plenty of detail if you spend some time with it.

We're going to use `enzyme.shallow()` to render our component so we can run tests on it.  Doing so is simple:
`const wrapper = shallow(<SimpleReactComponent />);`

`shallow()` returns a `ShallowWrapper` object that has a ton of methods for inspecting what was rendered.  Some of the most intuitive are `.text()` and `.html()`.

One of the most useful methods you'll find on many enzyme objects is `.get()`.  This takes an index value and will return the element of the tree at that index.  ie:
```
<ContainerElement>
  <ElementOne></ElementOne>
  <ElementTwo></ElementTwo>
<ContainerElement>
```

Calling `shallow(<ConainerElement />).get(1)` will return `<ElementTwo>` as a `ReactElement`.  Note that we get a ReactElement (instead of a wrapper) and that's just fine for checking the rendered elements and html of a component, however, when checking props there are some wrinkles... which leads us to:

# ComponentWithProps
Using `shallow()` is a great way to do proper unit tests in react, the advantage and the drawback is that it will not fully render any components further down the tree, instead simply returning the component tag.

Take a look at our component definition and the expected output in the tests, you'll notice that we don't expect to see `<h4>This won't get rendered</h4>`
from the internal component in our output.

If we're dilligently testing each component and we fully understand how props are getting passed around, `shallow()` is great and simple way to be sure each component behaves as it should in isolation.

This approach breaks down when we're trying to use more complex architechures and don't yet understand how they wire everything together.  Enzyme is a great tool for exploring these environments, so let's start digging deeper.

# ReactReduxComponent
Where before we assigned properties to a react component when and where we wrote their tags (ie: `<ComponentWithProps greeting={'HELLO WORLD'}/>`), now we're going to use Redux for managing that process.  There a number of reasons why redux is a better design pattern and no shortage of blogs on the internet to read if you want to know more about why :)

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

Further complicating the situation is the special `connect()` function that comes with the `react-redux` library.  This function takes in a Component and a set of functions that define how we want our component to interact with redux.  The easiest to explain is `mapStateToProps`.  Here we map the name of a property we want in our component to the selector function of our redux store.

`connect()` has a bunch of automagic that will handle wiring up the details of this for us. which is nice.  The downside is that `connect()` will return our component wrapped inside another component..

This means that when we use Enzyme to render our components the `shallow()` option isn't sufficient.  Instead we need to use `mount()` which will render the entire tree.

Once we understand Redux, the comments in the test will explain what's going on well enough.  The one key thing to pay attention to is how we set the value of `greeting` by dispatching an action to redux instead of setting the prop directly: `store.dispatch(setGreeting('Hello!'));`
