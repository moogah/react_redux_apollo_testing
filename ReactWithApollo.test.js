import React from 'react';
import {Query} from 'react-apollo';
import {MockedProvider} from 'react-apollo/test-utils';
import {createStore} from 'redux';
import reducer, {getGreeting, setGreeting, setNice, getNice, SET_GREETING, BE_NICE} from './reduxStore';
import {Provider} from 'react-redux';
import {shallow, mount} from 'enzyme';
import ConnectedReactWithApollo, {GREETING_QUERY, ReactWithApolloHoC, ReactWithApollo} from './ReactWithApollo';

// see ReactWithRedux for more info on testing React components with the Redux store

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Apollo provides us with a MockedProvider so we can define an array of request-response
// objects to simulate having an actual graphql backend.
// each item in this array should have a request object with a distince set of input variables
// the MockedProvider will look at the inputs we send in out tests, map them to a request that 
// matches and send back the associated response.
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

describe('Redux', async () => {
  it('Adds a beNice parameter to the store when the greet action is invoked', async () => {
      const action = {
        type: BE_NICE,
        beNice: true
      };

      const result = reducer(undefined, action);
      expect(result).toEqual({greeting: undefined, beNice: true});
  });
});

describe('<ReactWithApollo />', async () => {
  it('', async () => {
    // In addition to the Provider we're using to test the redux store,
    // we also need to wrap that in a MockedProvider that will connect our
    // components to our mocked graphql queries
    const wrapper = mount(
      <MockedProvider mocks={greetingQueryMock} addTypename={false}>
        <Provider store={store}>
          <ConnectedReactWithApollo />
        </Provider>
      </MockedProvider>
    );

    // just like in the ReactWithRedux example our store starts off
    // in the default state and our component is rendered without a greeting
    const providerProps = wrapper.find(Provider).props();
    expect(providerProps.store.getState()).toEqual({greeting: undefined});
    expect(wrapper.find(ReactWithApollo).html()).toBe('<h3></h3>');

    // in the ReactWithRedux example we set our greeting directly through the 
    // store and actions here we're going to query an appropriate greeting from 
    // graphql using a beNice query parameter
    store.dispatch(setNice(true));

    // The store will have the value of our beNice param, but no greeting yet
    expect(providerProps.store.getState()).toEqual({greeting: undefined, beNice: true});

    // Because the HoC introduces async processing, we need to wait for components to re-render
    await updateWrapper(wrapper);

    // and we can see that our HoC has been assigned props from the redux store
    const hoc = wrapper.find(ReactWithApolloHoC);
    expect(hoc.props().beNice).toBe(true);

    // Our query has recieved the beNice prop as well
    const query = wrapper.find(Query);
    expect(query.props().variables.beNice).toBe(true);
    // check that we're not passing any unexpected values to the query variables
    expect(Object.keys(query.props().variables)).toEqual(['beNice']);

    // and finally we can see our component has recieved its greeting
    const component = wrapper.find(ReactWithApollo);
    expect(component.props().GreetingQuery.greeting).toBe('Howdy!');
    expect(component.html()).toBe('<h3>Howdy!</h3>')
  });
});