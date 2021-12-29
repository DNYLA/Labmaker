import { InputBox } from '../../components/Inputs/InputBox';
import { Switch } from '../../components/Inputs/Switch';
import ReactDropdown from 'react-dropdown';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ContainerStyle, StyledSpan } from '../../styles/Styles';
import { updateDiscord } from '../../utils/slices/configSlices';
import { GuildConfig } from '../../utils/types';

type SettingsProp = {
  config: GuildConfig;
  parsedGuilds: any;
  changeEvent: any;
};

export const GeneralSettings = ({
  config,
  parsedGuilds,
  changeEvent,
}: SettingsProp) => {
  const dispatch = useDispatch();

  if (parsedGuilds.length === 0) {
    return <div></div>;
  } else {
    return (
      <GeneralSettingContainer id="comboContainer">
        <h1>General</h1>
        <StyledSpan>Payment Config</StyledSpan>
        <ReactDropdown
          options={
            parsedGuilds ? parsedGuilds : [{ value: 'Empty', label: 'Empty' }]
          }
          value={config.paymentConfigId}
          onChange={(e) => changeEvent(e)}
        />
        <br />
        <InputBox
          message="Bot Image URL"
          value={config.embedImageUrl}
          onChange={(e: any) => {
            dispatch(
              updateDiscord({
                ...config,
                embedImageUrl: e.target.value,
              })
            );
          }}
        />
        <Switch
          message="Advance User Switcher"
          toggled={config.autoSwitcher}
          onToggle={() => {
            dispatch(
              updateDiscord({
                ...config,
                autoSwitcher: !config.autoSwitcher,
              })
            );
          }}
        />
        <Switch
          message="Auto Creete Ticket"
          toggled={config.autoTicket}
          onToggle={() => {
            dispatch(
              updateDiscord({
                ...config,
                autoTicket: !config.autoTicket,
              })
            );
          }}
        />
        <Switch
          message="Auto Reacter"
          toggled={config.autoReact}
          onToggle={() => {
            dispatch(
              updateDiscord({
                ...config,
                autoReact: !config.autoReact,
              })
            );
          }}
        />
      </GeneralSettingContainer>
    );
  }
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
