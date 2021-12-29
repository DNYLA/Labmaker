import styled from 'styled-components';

export const BasePageStyle = styled.div`
  padding: 0px 50px;
  height: 100%;
  width: calc(100% - 85px);
  margin-left: 85px;
  margin-top: 100px;
  color: white;
  position: absolute;
  box-sizing: border-box;
  @media (max-width: 812px) {
    width: 80%;
  }
`;

export const ContainerStyle = styled.div`
  margin-top: 15px;
  transition: all 4.5s ease;
  //box-shadow: 5px 1px 35px 5px rgba(0, 0, 0, 0.35);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  /* box-shadow: 0px 3px 19px 6px rgba(0, 0, 0, 0.33);
  -webkit-box-shadow: 0px 3px 19px 6px rgba(0, 0, 0, 0.33);
  -moz-box-shadow: 0px 3px 19px 6px rgba(0, 0, 0, 0.33); */
  padding: 20px 0px 20px 15px;
  width: 100%;
  border-radius: 5px;
  background-color: ${(props) => props.theme.base.container};
`;

export const SelectorContainer = styled(ContainerStyle)`
  display: flex;
  justify-content: center;

  .selector {
    margin: 0px 15px;
  }
`;

export const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    margin-right: 25px;
  }
`;

export const CustomButton = styled.button`
  width: 50%;
  height: 28px;
  border: none;
  background-color: #313c4b;
  border-radius: 5px;
  justify-content: center;
  color: white;
  font-family: 'Lexend Deca';
  font-size: 18px;
  outline: none;

  :active {
    border: none;
  }

  :hover {
    background-color: #455366;
    transition: 0.5s;
    cursor: pointer;
  }
  transition: 0.5s;
`;

export const DisableDrag = styled.div`
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
`;

export const GeneralSettingContainer = styled(ContainerStyle)`
  display: flex;
  flex-direction: column;
  padding: 25px;

  h1 {
    text-align: center;
    border-radius: 5px;
    width: 100%;
    padding-bottom: 10px;
  }

  .inputBox {
    width: 100%;
    padding-bottom: 10px;
  }
`;
