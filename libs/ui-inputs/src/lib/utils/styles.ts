import styled from 'styled-components';

export const ComboContainer = styled.div`
  display: flex;
  width: 100%;

  #comboContainer {
    margin-left: 15px;
  }

  & > *:not(:last-child) {
    margin-right: 25px;
  }

  @media (max-width: 800px) {
    flex-flow: column;

    & > *:not(:last-child) {
      margin-right: 0px;
    }
  }
`;

export const IconButton = styled.div`
  display: inline;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.input.backCol};
  border-radius: 5px;
  transition: all 200ms ease;

  &:not(:last-child) {
    margin-right: 5px;
  }

  :hover {
    background-color: ${(props) => props.theme.input.activeCol};
    cursor: pointer;
  }

  &:hover .fa-trash-alt {
    color: rgba(255, 0, 0, 0.8);
  }

  @media (max-width: 800px) {
    width: 48px;
    height: 48px;
  }
`;
