import styled from 'styled-components';

export const ComboContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  margin-left: 5px;
  width: 100%;
  #comboContainer {
    margin-left: 15px;
  }

  @media (max-width: 812px) {
    display: inline;
  }
`;

export const IconButton = styled.div`
  display: inline;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 20px 0; */
  margin-right: 5px;
  transition: 250ms all;
  &:hover .fa-trash-alt {
    color: rgba(255, 0, 0, 0.8);
  }
  background-color: ${(props) => props.theme.input.backCol};
  :hover {
    background-color: ${(props) => props.theme.input.activeCol};
    cursor: pointer;
  }
  @media (max-width: 812px) {
    width: 50px;
    height: 45px;
    svg {
      padding-top: 10px;
    }
  }
`;
