import { SettingsContainer } from '../../assets/styles';
import styled from 'styled-components';
import {
  DropDown,
  InputBox,
  IOnDropDownChange,
  Item,
  SwitchToggle,
} from '@labmaker/ui-inputs';
import { useDispatch } from 'react-redux';
import { GuildConfig } from '../../utils/types';
import ReactDropdown from 'react-dropdown';
import { setDiscordConfig } from '../../utils/slices/configSlices';

/* eslint-disable-next-line */
export interface GeneralSettingsProps {
  config: GuildConfig;
  parsedGuilds: Item[];
  changeEvent: IOnDropDownChange;
}

export function GeneralSettings({
  config,
  parsedGuilds,
  changeEvent,
}: GeneralSettingsProps) {
  const dispatch = useDispatch();

  console.log(parsedGuilds);

  return (
    <SettingsContainer id="GeneralSettings">
      <h1>General</h1>
      <StyledSpan>Payment Config</StyledSpan>
      <DropDown items={parsedGuilds} onChange={changeEvent} />
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
        message="Advanced User Switcher"
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
        message="Auto Create Ticket"
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

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
`;
