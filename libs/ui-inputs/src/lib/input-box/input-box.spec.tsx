import { render } from '@testing-library/react';

import InputBox from './input-box';

describe('InputBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputBox />);
    expect(baseElement).toBeTruthy();
  });
});
