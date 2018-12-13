import React from 'react';
import {shallow} from 'enzyme';
import SimpleReactComponent from './SimpleReactComponent';

describe('<SimpleReactComponent />', async () => {
  it('Renders static HTML', async () => {
    const wrapper = shallow(<SimpleReactComponent />);

    // enzyme.shallow returns a ShallowWrapper object
    // see the API here for it's methods https://airbnb.io/enzyme/docs/api/shallow.html
    
    // We can use the .html() method to get a text rendering.
    expect(wrapper.html()).toBe('<h3>HELLO WORLD</h3>');

    // .text() will return the inner html
    expect(wrapper.text()).toBe('HELLO WORLD');

    // .get() will retrieve the rendered elementy by index
    // We have to use toEqual here because the rendered result we get()
    // will not be the _exact same element "in memory"_ as the expected definition we pass in
    expect(wrapper.get(0)).toEqual(<h3>HELLO WORLD</h3>);

    // maybe the most important method of wrapper is .debug()
    // this is perfect for using with console.log(), not something you actually
    // want to use in an expect()
    expect(wrapper.debug()).toBe('<h3>\n  HELLO WORLD\n</h3>');
  });
});