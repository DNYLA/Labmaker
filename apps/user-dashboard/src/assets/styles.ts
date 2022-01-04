import styled from 'styled-components';

export const ContainerStyle = styled.div`
  margin-top: 15px;
  transition: all 4.5s ease;
  //box-shadow: 5px 1px 35px 5px rgba(0, 0, 0, 0.35);
  /* box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; */
  /* box-shadow: 0px 3px 19px 6px rgba(0, 0, 0, 0.33);
  -webkit-box-shadow: 0px 3px 19px 6px rgba(0, 0, 0, 0.33);
  -moz-box-shadow: 0px 3px 19px 6px rgba(0, 0, 0, 0.33); */
  padding: 20px 0px 20px 15px;
  width: 100%;
  border-radius: 5px;
  background-color: ${(props) => props.theme.base.backCol};
`;

export const SettingsContainer = styled(ContainerStyle)`
  display: flex;
  flex-direction: column;
  padding: 25px;
  padding-top: 5px;
  h1 {
    /* text-align: center; */
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
  @media (max-width: 812px) {
    display: block;
  }
`;
