import React from 'react';
import {createStore} from 'redux';
import reducer, {getGreeting, setGreeting, SET_GREETING} from './reduxStore';
import {Provider} from 'react-redux';
import {shallow, mount} from 'enzyme';
import ReactWithRedux from './ReactWithRedux';

// the redux store itself is just a javascript object, so we can
// create one and inject it into our test environment without much hassle
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// because a reducer is just a plain js funtion, it's easy to unit test
describe('reducer', async () => {
    it('passes back the default state object if an unrecognized action is passed in and no state object is provided', async () => {
      const action = {
        type: 'RANDOM_ACTION'
      }

      // because the reducer uses positional arguments, pass undefined as the first
      // to get back the initial state
      const result = reducer(undefined, action);
      expect(result).toEqual({greeting: undefined});
    });

    it('passes back a state object if one is passed in', async () => {
      const action = {
        type: 'RANDOM_ACTION'
      };

      const state = {
        greeting: 'MALARKY'
      };

      // because the reducer uses positional arguments, pass undefined as the first
      // to get back the initial state
      const result = reducer(state, action);
      expect(result).toEqual({greeting: 'MALARKY'});
    });

    it('Passes back a new state object along with new data passed into it from a recognized action', async () => {
      // here we define an action with a type that's included in the reducer along with
      // some new data
      const action = {
        type: SET_GREETING,
        greeting: 'HULLO!'
      };

      // well pass undefined again so the reducer will start with the default state object
      // since there is only one value in our state, this really doen't matter
      const result = reducer(undefined, action);
      expect(result).toEqual({greeting: 'HULLO!'});
    });
});

// selectors are also just plain js functions
// all they do is pick out some values from a passed in object and return them
describe('selector', async () => {
  it('Returns the greeting from a state object', async () => {
    const state = {
      greeting: 'Howdy!'
    };

    const result = getGreeting(state);
    expect(result).toBe('Howdy!');
  })
});

// actions are easy to test too, all they do is take a value and wrap it in an
// object that defines the action
describe('action', async () => {
  it('Wraps a value in an action object', async () => {
    const value = 'Ahoy!';

    const result = setGreeting(value);
    expect(result).toEqual({type: SET_GREETING, greeting: 'Ahoy!'});
  });
});

describe('<ReactWithRedux />', async () => {
  it('', async () => {
    // To connect a React component to redux it needs to be wrapped in a Provider
    // because we need both the Provider and the ReactWithRedux components to 
    // render, now we need to use enzyme.mount()
    const wrapper = mount(<Provider store={store}><ReactWithRedux /></Provider>);

    // Take a look at this to see how connect() wraps our component
    //console.log(wrapper.debug());

    const providerProps = wrapper.props();

    // the provider will also contain the store and it's current state
    expect(providerProps.store.getState()).toEqual({greeting: undefined});

    // and our component will have the default greeting
    expect(wrapper.find(ReactWithRedux).html()).toBe('<h3></h3>');

    // and we can change this state by dispatching an action to the store
    store.dispatch(setGreeting('Hello!'));

    // The store will have the new value
    expect(providerProps.store.getState()).toEqual({greeting: 'Hello!'});
    // and our component will have it's greeting
    const reactWithRedux = wrapper.find(ReactWithRedux);
    expect(reactWithRedux.html()).toBe('<h3>Hello!</h3>');

    // there is a problem though, even though we can "see" the updated
    // component with .html(), this change has not yet been rendered
    console.log(reactWithRedux.props());
    expect(reactWithRedux.get(0).props.greeting).toBe(undefined);

    // the solution is simple, enzyme provides us a way to force a re-render
    wrapper.update();
    const reRenderedReactWithRedux = wrapper.find(ReactWithRedux);
    console.log(reRenderedReactWithRedux.debug());
    //console.log(reRenderedReactWithRedux.instance().props);
    //expect(reRenderedReactWithRedux.props.greeting).toBe('Hello!');
  });
});