// define a constant identifier for each of our action types
const SET_GREETING = 'SET_GREETING';

// create a function that knows how to get a property out of the state object
const getGreeting = state => state.greeting;

// and a function that maps an incoming parameter
// to an action object
const setGreeting = greeting => ({
  type: SET_GREETING,
  greeting
});

// define an initial state object
const initialState = {
  greeting: undefined
};

// create a reducer function that can map an action type
// to the correct state mutation
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GREETING:
      return {
        ...state,
        greeting: action.greeting
      };
    default:
      return state;
  }
};

export default reducer;

export {
  SET_GREETING,
  setGreeting,
  getGreeting
}
