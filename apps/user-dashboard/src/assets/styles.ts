import styled from 'styled-components';

export const ContainerStyle = styled.div`
  margin-top: 15px;
  width: 100%;
  border-radius: 5px;
  background-color: ${(props) => props.theme.base.backCol};
`;

export const SettingsContainer = styled(ContainerStyle)`
  display: flex;
  flex-flow: column;
  padding-top: 5px;

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
