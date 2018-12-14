import React from 'react';
import {shallow} from 'enzyme';
import ComponentWithProps, {InternalComponent} from './ComponentWithProps';

// see SimpleReactComponent for more info on enzyme.shallow

describe('<ComponentWithProps />', async () => {
  it('Renders an empty element if we don\'t provide the expected prop', async () => {
    const wrapper = shallow(<ComponentWithProps />);

    expect(wrapper.get(0)).toEqual(<div><h3 /><InternalComponent /></div>);
  });

  it('Renders the prop when we pass it in', async () => {
    const wrapper = shallow(<ComponentWithProps greeting={'HELLO WORLD'}/>);

    expect(wrapper.get(0)).toEqual(<div><h3>HELLO WORLD</h3><InternalComponent greeting="HELLO WORLD" /></div>);
  });

  it('Accepts whatever props we pass in', async () => {
    const wrapper = shallow(<ComponentWithProps greeting={'HELLO WORLD'} someprop={'BLATZ'}/>);

    // wrapper.props() doesn't return the props of a specific component 
    // as you might think.  Instead it returns a special object that's not
    // very useful as far as I can tell.
    const renderedProps = wrapper.props();
    expect(renderedProps.children[0]).toEqual(<h3>HELLO WORLD</h3>);

    // wrapper.instance() will give us the actual instance
    const instanceProps = wrapper.instance().props;
    expect(instanceProps.greeting).toBe('HELLO WORLD');
    expect(instanceProps.someprop).toBe('BLATZ');

    // Here we can see that our main component got it's props and rendered them
    // as we want *and* we can see that the inner component doesn't actually
    // get rendered by .shallow()
    expect(wrapper.get(0)).toEqual(<div><h3>HELLO WORLD</h3><InternalComponent greeting="HELLO WORLD" /></div>);

    // we can use wrapper.find() to get access to our internal component and check
    // that it got props assigned to it though
    const internalComponentProps = wrapper.find(InternalComponent).props();
    expect(internalComponentProps.greeting).toBe('HELLO WORLD');
  });
});