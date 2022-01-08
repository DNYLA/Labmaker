import { SettingsContainer } from '../../assets/styles';
import styled from 'styled-components';
import { DropDown, InputBox, SwitchToggle } from '@labmaker/ui-inputs';
import { useDispatch } from 'react-redux';
import { GuildConfig } from '../../utils/types';
import ReactDropdown from 'react-dropdown';
import { setDiscordConfig } from '../../utils/slices/configSlices';

/* eslint-disable-next-line */
export interface GeneralSettingsProps {
  config: GuildConfig;
  parsedGuilds: any;
  changeEvent: any;
}

const StyledGeneralSettings = styled.div`
  color: pink;
`;

export function GeneralSettings({
  config,
  parsedGuilds,
  changeEvent,
}: GeneralSettingsProps) {
  const dispatch = useDispatch();

  if (parsedGuilds.length === 0) {
    return <div></div>;
  } else {
    return (
      <SettingsContainer id="comboContainer">
        <h1>General</h1>
        <StyledSpan>Payment Config</StyledSpan>
        <ReactDropdown
          options={
            parsedGuilds ? parsedGuilds : [{ value: 'Empty', label: 'Empty' }]
          }
          value={config.paymentConfigId}
          onChange={(e) => changeEvent(e)}
        />
        {/* <DropDown
          items={parsedGuilds ? parsedGuilds : [{value: 'Empty'}]}
          selected={undefined}
          setSelected={function (value: SetStateAction<Item>): void {
            throw new Error('Function not implemented.');
          }}
          onChange={undefined}
        /> */}
        <br />
        <InputBox
          message="Bot Image URL"
          value={config.embedImageUrl}
          onChange={(e: any) => {
            dispatch(
              setDiscordConfig({
                ...config,
                embedImageUrl: e.target.value,
              })
            );
          }}
        />
        <SwitchToggle
          message="Advance User Switcher"
          toggled={config.autoSwitcher}
          onToggle={() => {
            dispatch(
              setDiscordConfig({
                ...config,
                autoSwitcher: !config.autoSwitcher,
              })
            );
          }}
        />
        <SwitchToggle
          message="Auto Creete Ticket"
          toggled={config.autoTicket}
          onToggle={() => {
            dispatch(
              setDiscordConfig({
                ...config,
                autoTicket: !config.autoTicket,
              })
            );
          }}
        />
        <SwitchToggle
          message="Auto Reacter"
          toggled={config.autoReact}
          onToggle={() => {
            dispatch(
              setDiscordConfig({
                ...config,
                autoReact: !config.autoReact,
              })
            );
          }}
        />
      </SettingsContainer>
    );
  }
}

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
`;
