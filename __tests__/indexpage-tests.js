/* global
    jest
    describe
    it
    expect
*/
jest.unmock('../ui/js/components/indexPage');

import React from 'react';
import { shallow } from 'enzyme';
import IndexPage from '../ui/js/components/indexPage';

describe('Render', () => {
    let wrap = shallow(<IndexPage />);
    it('Should render without breaking', () => {
        expect(wrap.find('div').length).toBe(1);
    });
});
