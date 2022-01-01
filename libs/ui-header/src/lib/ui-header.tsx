import styled from 'styled-components';

/* eslint-disable-next-line */
export interface UiHeaderProps {}

const StyledUiHeader = styled.div``;

export function UiHeader(props: UiHeaderProps) {
  return (
    <StyledUiHeader>
      <h1>Welcome to UiHeader!</h1>
    </StyledUiHeader>
  );
}

export default UiHeader;
