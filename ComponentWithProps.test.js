import React from 'react';
import {shallow} from 'enzyme';
import ComponentWithProps from './ComponentWithProps';

// see SimpleReactComponent for more info on enzyme.shallow

describe('<ComponentWithProps />', async () => {
  it('Renders an empty element if we don\'t provide the expected prop', async () => {
    const wrapper = shallow(<ComponentWithProps />);

    expect(wrapper.get(0)).toEqual(<h3></h3>);
  });

  it('Renders the prop when we pass it in', async () => {
    const wrapper = shallow(<ComponentWithProps greeting={'HELLO WORLD'}/>);

    expect(wrapper.get(0)).toEqual(<h3>HELLO WORLD</h3>);
  });

  it('Accepts whatever props we pass in', async () => {
    const wrapper = shallow(<ComponentWithProps greeting={'HELLO WORLD'} someprop={'BLATZ'}/>);

    // wrapper.props() only returns props that are actually rendered
    // and then only in a hash, so we can't test wrapper.props().greeting
    const renderedProps = wrapper.props();
    expect(renderedProps).toEqual({children: 'HELLO WORLD'})

    // wrapper.instance() will give us the actual instance
    const instanceProps = wrapper.instance().props;
    expect(instanceProps.greeting).toBe('HELLO WORLD');
    expect(instanceProps.someprop).toBe('BLATZ');

    expect(wrapper.get(0)).toEqual(<h3>HELLO WORLD</h3>);
  });
});