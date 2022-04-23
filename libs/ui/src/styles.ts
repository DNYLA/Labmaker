import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 20px 50px;
`;

export const Content = styled.div`
  display: flex;
  flex: 1 0 auto;
  height: 100%;
  flex-flow: column;
  min-width: 750px;
  max-width: 750px;
  transition: min-width 200ms ease;

  @media (min-width: 1000px) {
    min-width: 900px;
  }

  @media (max-width: 800px) {
    min-width: unset;
    width: 100%;
  }
`;

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

export const DisableDrag = styled.div`
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const ContainerStyle = styled.div`
  margin-bottom: 15px;
  width: 100%;
  border-radius: 5px;
  background-color: ${(props) => props.theme.base.backCol};
`;

export const SettingsContainer = styled(ContainerStyle)`
  display: flex;
  flex-flow: column;
  padding-top: 5px;

  & > * {
    margin-bottom: 15px;
  }

  h1 {
    border-radius: 5px;
    width: 100%;
    font-size: 24px;
    user-select: none;
    margin-bottom: 25px;
  }

  .inputBox {
    width: 100%;
    padding-bottom: 10px;
  }
`;

export const CenteredText = styled.div`
  text-align: center;
`;
