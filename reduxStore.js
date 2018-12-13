// Note that calling this file "reduxStore" is a misnomer.  
// All we're defining here are the functions needed to interact with the reduxStore,
// the store itself is managed by the redux library.

// define a constant identifier for each of our action types
const SET_GREETING = 'SET_GREETING';
const BE_NICE = 'BE_NICE';

// create a function that knows how to get a property out of the state object
const getGreeting = state => state.greeting;
const getNice = state => state.beNice;

// and a function that maps an incoming parameter
// to an action object
const setGreeting = greeting => ({
  type: SET_GREETING,
  greeting
});

const setNice = beNice => ({
  type: BE_NICE,
  beNice
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
    case BE_NICE:
      return {
        ...state,
        beNice: action.beNice
      }
    default:
      return state;
  }
};

export default reducer;

export {
  SET_GREETING,
  BE_NICE,
  setGreeting,
  getGreeting,
  getNice,
  setNice
}
