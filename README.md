# Basic Setup
_In most projects you will probably find this work is already done.  However, because of how many moving parts are involved in this setup you may find that these examples don't work at all or maybe work in some subtly different way.  This section is to provide enough background info on the libraries involved so you can google your way out of a confusing situation._

#### Requirements:
The simplest "Hello World" of testing in react requires a bit of setup to get going.  Beyond the obvious installation of Node/NPM and Jest we will also need to install a transpiling toolset called babel along with a series of plugins and presets for babel that will allow Jest to understand the special syntax involved in writing React components.

##### jest.config.js

For this project we're going to use the default settings for jest.  This means it will recognize any file ending with .test.js as a test file.

The only thing special we need to do is provide jest with a `setupFile` parameter in the config file that will handle some boilerplate needed for Enzyme.  This file will be executed at the start of each jest run, but note that if you're using the `--watch` option you will need to quit and re-run watch to re-load the `setupFile`.

Speaking of `--watch`, take a look at `package.json`.  The `scripts` section is where we define a series of aliases for commands that can be invoked in the command line with `npm run [alias]`.  A powerful feature of these aliases is that we can chain them into each other, in this case the alias `test-watch` also uses the alias `test` in its command.  _ie:_ running `npm run test-watch` will run the following command:
```
npm test cross-env NODE_ENV=test jest -- --watch
```
##### enzyme test helper

Check out `setupEnzyme.js`.  This is a simple javascript file that sets up the Adapters needed by Enzyme.  We could just include this code in the files that actually use Enzyme, but for this project it isn't necessary.

##### babel, plugins, presets and .babelrc

The most important thing in this section is that Jest has some automagic in it's code; it will look for the presence of a `.babelrc` file in the root of the repository.  If it finds one, it will include the babel transpilier to interpret both our .js and .test.js files before Jest runs them.  This is relevant because defining React components in ES6 javascript uses syntax that is not tecnically valid.  _ie_:

```
return (
  <h3>HELLO WORLD</h3>
);
```
This isn't valid statement in any other language I've seen.  Some light research leads me to believe this is "JSX".  Without babel to interpret this code before Jest runs it you'll have a bad time.

Here we rely on npm install to get all the plugins needed.  Unfortunalty I've not found any one reference that explains exactly what you need, so for now all we can do is reference an existing and working `package.lock` file for the list of packages used.  Take a look at `package.json` and search for everything that matches `babel*`.  

Once we've installed all these plugins and presets, we need to create a `.babelrc` file at the root of the repo and specify the plugins and presets we're using.  Some of the packages we've installed will be included as plugins in this file, others are part of the presets.  Again, I don't have a concise set of documentation on the what and why of this.

If you're interested in researching this further, here are some places to start:

https://stackoverflow.com/questions/48137486/jest-enzyme-shallow-unexpected-token
https://github.com/lelandrichardson/enzyme-example-jest/blob/master/.babelrc
https://github.com/airbnb/babel-preset-airbnb
https://github.com/vuejs/vue-cli/issues/2432

# SimpleReactComponent
Let's start with the easiest possible example so we can focus on what the Enzyme framework does and what we can do with its API.

The component itself is bog standard and only returns some static HTML.  I'll leave a detailed explanation of React components to some other tutorial.

Instead let's focus on Enzyme.  The best reference material I've found for it is the API docs in their github repo https://github.com/airbnb/enzyme/tree/master/docs/api/ShallowWrapper.  It lacks in narrative, but provides plenty of detail if you spend some time with it.

We're going to use `enzyme.shallow()` to render our component so we can run tests on it.  Doing so is simple:
```javascript
const wrapper = shallow(<SimpleReactComponent />);
```

`shallow()` returns a `ShallowWrapper` object that has a ton of methods for inspecting what was rendered.  Some of the most intuitive are `.text()` and `.html()`.  Check out `SimpleReactComponet.test.js` for examples.

# ComponentWithProps
Using `shallow()` is a great way to do proper unit tests in react, the advantage and the drawback is that it will not fully render any components further down the tree, instead simply returning the component tag.

Take a look at our component definition and the expected output in the tests, you'll notice that we don't expect to see `<h4>This won't get rendered</h4>`
from the internal component in our output.

If we're dilligently testing each component and we fully understand how props are getting passed around, `shallow()` is a great and simple way to be sure each component behaves as it should in isolation.

This approach breaks down when we're trying to use more complex architechures and don't yet understand how they wire everything together.  Instead of constantly waiting for a browser to update, we can continue using Enzyme to explore these new and complicated environments, so let's dig deeper.

# ReactReduxComponent
In the previous examples we assigned properties to a react component when and where we wrote their tags, _ie:_
```javascript
<ComponentWithProps greeting={'HELLO WORLD'}/>
```  
Now we're going to use Redux for managing that process.  There a number of reasons why redux is a better design pattern and no shortage of blogs to read if you want to know more about why :)

#### Redux, in tweet-sized bites
A short explanation of redux is that it provides us with a javascript object that contains all the data in our application along with a set of functions for mapping these values to the properties of our components.  As extra special sauce, the redux engine can be connected to the React engine so those components are automagically re-rendered when a relevant state parameter is updated.  

Unlike a class that has get() and set() methods that can be called directly, we interact with redux by setting values with an "action" and get them with a "selector".  Another design concept called a "reducer" is responsible for interpreting actions that are passed to it, creating a change of the redux state.

##### Actions
An action is simply a js object that has a `type` property and then some additional properties which can be defined as we please.  _ie:_
```javascript
actionDefinition = {
  type: 'MY_ACTION_ID',
  greeting: 'Howdy'
}
```
only the `type` value is needed and its value is essentially arbitrary, but that value needs to be consistently used to identify any particular action.

##### Selectors
Selectors are simple functions that take in an object and return a single element of it.  They are typically written with the terse function notation that javascript provides.

```
const getGreeting = state => state.greeting;
```

is the same as
```
function getGreeting(state) {
  return state.greeting;
}
```

##### Reducers
A simple reducer is a function that knows how to check the type of an action and then perform the appropriate process to merge the action's additional parameters into the current state object, combining these new properties with the existing state and passing back a new state object as a result.  _ie:_
```javascript
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
    return {...state, name: action.name}
  }
}
```

if we pass `action` and `state` to `reducer()` we will get back a new state object:
```javascript
{
  title: 'El Capitan',
  name: 'Fred'
}
```

`...state` means we will return all properties of `state` not specifially named later in the return object.  It's a useful bit of syntatical sugar that javascript gives us so we don't need to run a bunch of `if` statements to compare the values of the current state with the incoming paremeters of the action.

The typical pattern for a project using redux will have the actions, reducers and selectors spread into their own subfolders, but this is not necessary.  To make it easier to experiment with them I've created a single file called `reduxStore.js` that contains all of these elements.

##### Testing Redux
I've overstuffed the `ReactWithRedux.test.js` file with tests for each part of the redux store to demonstrate how they work individually.  In common cases Redux is composed of plain functions, so there is no special design pattern needed to unit test them.

##### Testing React with Redux (wrappers all the way down)

Relative to the simplicity of testing Redux, ReactComponents that are connected to a Redux store are  complicated to test.  The first wrinkle is that we need to wrap our component in a `<Provider>` component in our tests, and because of this using `shallow()` won't help. We the `<Provider>` to work with Redux _and_ we still need to see our `ReactWithRedux` component get rendered to test it, so now we will use `.mount()` instead.

```javascript
const wrapper = mount(<Provider store={store}><ReactWithRedux /></Provider>);
```

Further complicating the situation is the special `connect()` function that comes with the `react-redux` library.  This function takes in a Component and a set of functions that define how we want our component to interact with redux.  The easiest to explain is `mapStateToProps` _ie:_
```javascript
const mapStateToProps = state => ({
  greeting: getGreeting(state)
});
```
Here we map the name of the property `greeting` we want in our component to the selector function `getGreeting()` of our redux store.

`connect()` has a bunch of automagic that will handle wiring up the details of this for us.  We get this with a bit of code like:
```javascript
const ConnectedReactWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactWithRedux);
```

This wires up the React and Redux engines for us, which is great.  Unfortunatly this also means our simple react component is no longer so simple:
```
<Provider store={{...}}>
  <Connect(ReactWithRedux)>
    <ReactWithRedux greeting={[undefined]} actions={{...}}>
      <h3 className="findMe" />
    </ReactWithRedux>
  </Connect(ReactWithRedux)>
</Provider>
```

This is particularly painful now because using `wrapper.find(ReactWithRedux)` will still return the wrapper component `<Connect(ReactWithRedux>` where we would expect to find only the `<ReactWithRedux>`  component we're interested in.  Most relevant here is that if we check `wrapper.find(ReactWithRedux).props()` we'll find an empty object, where we might be expecting to see `greeting` and `actions` included in there.

This makes attempts to check props difficult, especially if we expect a prop to be `undefined`

```javascript
const reactWithRedux = wrapper.find(ReactWithRedux);
expect(reactWithRedux.props().greeting).toBe(undefined);
```
Although this may seem like a good test, it will pass even when there is no prop `greeting` on the wrapper.  For example, this also passes:

```javascript
const reactWithRedux = wrapper.find(ReactWithRedux);
expect(reactWithRedux.props().TOTALLYRANDOMCRAP).toBe(undefined);
```

Looking at the API for the various `*Wrapper` classes, there are `.get()` and `.at()` methods that at first glace seem helpful, but none of these are able to climb into a tree of elements, their indexing only looks for top level elements that are neighbors, _ie:_

```
<ContainerElementOne>
  <ElementOne></ElementOne>
</ContainerElementOne>
<ContainerElementTwo>
  <ElementTwo></ElementTwo>
</ContainerElementTwo>
```

calling `wrapper.get(1)` on a structure like this will return

```
<ContainerElementTwo>
  <ElementTwo></ElementTwo>
</ContainerElementTwo>
```

I've found no way to use a combination of `.find()` `.at()` and `.get()` to return `ElementOne` or `ElementTwo`.

Once we understand the components of Redux and how this results in our ReactWithRedux component being nested in the tree, the comments in the test will explain what's going on well enough.  The one key thing to pay attention to is how we set the value of `greeting` by dispatching an action to redux instead of setting the prop directly: `store.dispatch(setGreeting('Hello!'));`

```
  <Connect(ReactWithRedux)>
    <ReactWithRedux greeting={[undefined]} actions={{...}}>
      <h3 className="findMe" />
    </ReactWithRedux>
  </Connect(ReactWithRedux)>
```



# ReactWithApollo

Once you're familliar with the pitfalls of using `mount()` to render a full tree of react components we can add on the additional parts needed to connect them to GraphQL.  There are two more libraries required to do this: `react-apollo` and `graphql-tag`.

There is some boilerplate needed to configure our react application for this, but because we're focusing on unit tests it is unnecessary for this project.  If you're curious, check out the getting started documentation for Apollo here: https://www.apollographql.com/docs/react/essentials/get-started.html#creating-client.

Instead we want to focus on the `Query` component.  In the ReactWithRedux example we used the `connect()` function from `react-redux` to wrap our component and to use Apollo we're going to extend that pattern even further.  `connect()` and `Query` are both examples of a "Higher Order Component", which simply means these are functions or components that output a component in their rendering, and also take a component as input.  In ReactWithRedux we wrap our component in `connect()`:

```javascript
const ConnectedReactWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactWithRedux);
```

Now we're going to another element in between:
```javascript
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
```

and call `connect()` on this "HoC":
```javascript
const ConnectedReactWithApollo = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactWithApolloHoC);
```

`ReactWithApolloHoC` is a simple function in this example, but it's important to take a close look at what it does.  When React renders this component `Query` will be the first thing to output and it will handle executing our query, waiting for the response and finally passing that incoming data to our `ReactWithApollo` component.  

Query has three important things to focus on.  First provice it with a `query` prop that contains the definition of our graphql query:

```javascript
query={GREETING_QUERY}
```
Second we provide it with a `variables` prop that will map the incoming react properties of our component to the query
```javascript
variables={{beNice: props.beNice}}
```
Lastly we have `Query` return our desired component, passing into it the resulting data
```javascript
{({loading, error, data, fetchMore, refetch}) => {
  return (
    <ReactWithApollo
      {...props}
      {...data}
    />
  );
}}
```
It's out of scope for this project, but worth reading up on query and how to use `loading` and `error` to change what we render while the query is executing and when there is an error.

the constant `GREETING_QUERY` is a string that is defined with a special tag from the `graphql-tag` library.

```javacript
const GREETING_QUERY = gql`
  query($beNice: String) {
    GreetingQuery(beNice: $beNice) {
      greeting
    }
  }
`;
```

That's it.  This should look familliar to you if you've worked with graphql.  We declare it as a `const` so we can import this defintion in our test file for convience, but there's no technical reason we can't just hand-write the same definition in both places.

#### Testing a Query

We're going to add another library to our test file: `react-apollo/test-utils`.  This will let us use a `MockedProvider` to wrap around the `Provider` when mounting our component:
```javascript
const wrapper = mount(
  <MockedProvider mocks={greetingQueryMock} addTypename={false}>
    <Provider store={store}>
      <ConnectedReactWithApollo />
    </Provider>
  </MockedProvider>
);
```

The `MockedProvider` lets us create an array of query responses that will be returned when our query object passes in a `request` with matching variables:
```javascript
const greetingQueryMock = [
  {
    request: {
      query: GREETING_QUERY,
      variables: {
        beNice: true
      }
    },
    result: {
      data: {
        GreetingQuery: {
          greeting: 'Howdy!'
        }
      }
    }
  },
  {
    request: {
      query: GREETING_QUERY,
      variables: {
        beNice: false
      }
    },
    result: {
      data: {
        GreetingQuery: {
          greeting: 'Bugger Off!'
        }
      }
    }
  }
];
```

So creating a query with `beNice: true` will return `greeting: 'Howdy!'` and creating a query with `beNice: false` will return `greeting: 'Bugger Off!'`.

With our fake data backend created, testing starts the same as in ReactWithRedux.  Use `mount()` to render the tree, `.find()` to find components and check their properties and `store.dispatch()` to change the state of the application.

`Query` introduces an extra wrinkle however, because it executes the query asyncronously we need to use some questionable looking helper functions to force our test to wait long enough for the query to return before checking that our results are rendered as we expect.

```javascript
async function wait(ms) {
  let resolve;
  const promise = new Promise(r => (resolve = r));
  setTimeout(resolve, ms);
  await promise;
}

async function updateWrapper(wrapper, ms = 0) {
  await wait(ms);
  wrapper.update();
}
```

We use this like so:
```javascript
await updateWrapper(wrapper);
```

This seems wonky to me, but it comes straight from the source: https://blog.apollographql.com/testing-apollos-query-component-d575dc642e04

After calling `updateWrapper()` we can check that the query returned the expected results and our component rendered as expected, but before doing that let's take a closer look at what is rendered before we set the `beNice` parameter by adding some `.debug()` output:

```javascript
console.log(wrapper.debug());
console.log(wrapper.find(Query).props());
```

This shows:

```bash
console.log ReactWithApollo.test.js:99
  <MockedProvider mocks={{...}} addTypename={false}>
    <ApolloProvider client={{...}}>
      <Provider store={{...}}>
        <Connect(ReactWithApolloHoC)>
          <ReactWithApolloHoC beNice={[undefined]} actions={{...}}>
            <Query query={{...}} variables={{...}}>
              <ReactWithApollo beNice={[undefined]} actions={{...}}>
                <h3 />
              </ReactWithApollo>
            </Query>
          </ReactWithApolloHoC>
        </Connect(ReactWithApolloHoC)>
      </Provider>
    </ApolloProvider>
  </MockedProvider>
console.log ReactWithApollo.test.js:100
  { query:
     { kind: 'Document',
       definitions: [ [Object] ],
       loc: { start: 0, end: 90 } },
    variables: { beNice: undefined },
    children: [Function] }
```

Notice that the `Query` won't wait to execute and returned a `ReactWithApollo` component with the prop `beNice: undefined`.  We could easily add logic to `ReactWithApolloHoC` to control when the query is executed based on the value of some props, but that is getting out of scope for this project.

Like in ReactWithRedux the rendered output contains much more than the simple `<h3>` tag we're interested in and this can cause headaches as our components get more complicated, but the combination of `mount()` and `debug()` provide a powerful way to explore how all these libraries work together as you develop.

Finally, let's take a look at the result after the query is allowed to complete:


```bash
console.log ReactWithApollo.test.js:114
  <MockedProvider mocks={{...}} addTypename={false}>
    <ApolloProvider client={{...}}>
      <Provider store={{...}}>
        <Connect(ReactWithApolloHoC)>
          <ReactWithApolloHoC beNice={true} actions={{...}}>
            <Query query={{...}} variables={{...}}>
              <ReactWithApollo beNice={true} actions={{...}} GreetingQuery={{...}}>
                <h3>
                  Howdy!
                </h3>
              </ReactWithApollo>
            </Query>
          </ReactWithApolloHoC>
        </Connect(ReactWithApolloHoC)>
      </Provider>
    </ApolloProvider>
  </MockedProvider>
console.log ReactWithApollo.test.js:115
  { query:
     { kind: 'Document',
       definitions: [ [Object] ],
       loc: { start: 0, end: 90 } },
    variables: { beNice: true },
    children: [Function] }
```

The last thing I want to point out is how the results from `Query` are assigned as properties to `ReactWithApollo`.  We can see that it's recieved both the `beNice` and `actions` props from `ReactWithApolloHoC` _and_ an additonal prop `GreetingQuery`.

```javascript
<ReactWithApollo beNice={true} actions={{...}} GreetingQuery={{...}}>
```

This is because of how we've assigned `props` and `data` to `ReactWithApollo` inside our `Query`:

```javscript
<ReactWithApollo
  {...props}
  {...data}
  {...error}
/>
```
