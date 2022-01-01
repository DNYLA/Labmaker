import { render } from '@testing-library/react';

import UiInputs from './ui-inputs';

describe('UiInputs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiInputs />);
    expect(baseElement).toBeTruthy();
  });
});
