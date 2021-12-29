import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { InputBox } from '../../components/Inputs/InputBox';
import { Toggle } from '../../components/Toggle';
import { ContainerStyle } from '../../styles/Styles';
import { updateReddit } from '../../utils/slices/configSlices';
import { Node } from '../../utils/types';

type SettingsProp = {
  config: Node;
};

export const AccountSettings = ({ config }: SettingsProp) => {
  const dispatch = useDispatch();

  console.log(config);

  return (
    <GeneralSettingContainer id="comboContainer">
      <h1>Account</h1>
      <InputBox
        message="Client ID"
        value={config.clientId}
        onChange={(e: any) => {
          dispatch(
            updateReddit({
              ...config,
              clientId: e.target.value,
            })
          );
        }}
      />
      <InputBox
        message="Client Secret"
        value={config.clientSecret}
        onChange={(e: any) => {
          dispatch(
            updateReddit({
              ...config,
              clientSecret: e.target.value,
            })
          );
        }}
      />
      <InputBox
        message="Username"
        value={config.username}
        onChange={(e: any) => {
          dispatch(
            updateReddit({
              ...config,
              username: e.target.value,
            })
          );
        }}
      />
      <Toggle
        message="Password"
        value={config.password}
        visibleIcon={faEye}
        hiddenIcon={faEyeSlash}
        onChange={(e: any) => {
          dispatch(
            updateReddit({
              ...config,
              password: e.target.value,
            })
          );
        }}
      />
      <InputBox
        message="User Agent"
        value={config.userAgent}
        onChange={(e: any) => {
          dispatch(
            updateReddit({
              ...config,
              userAgent: e.target.value,
            })
          );
        }}
      />
    </GeneralSettingContainer>
  );
};

const GeneralSettingContainer = styled(ContainerStyle)`
  display: flex;
  flex-direction: column;
  padding: 25px;

  h1 {
    text-align: center;
    border-radius: 5px;
    width: 100%;
  }

  .inputBox {
    width: 100%;
    padding-bottom: 10px;
  }
  @media (max-width: 812px) {
    display: block;
  }
`;
