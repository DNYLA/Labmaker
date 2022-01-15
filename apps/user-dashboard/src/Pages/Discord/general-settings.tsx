import { SettingsContainer } from '../../assets/styles';
import styled from 'styled-components';
import {
  DropDown,
  InputBox,
  IOnDropDownChange,
  Item,
  SwitchToggle,
} from '@labmaker/ui';
import { useDispatch } from 'react-redux';
import ReactDropdown from 'react-dropdown';
import { setDiscordConfig } from '../../utils/slices/configSlices';
import { GuildConfig, GuildConfigDto } from '@labmaker/wrapper';

/* eslint-disable-next-line */
export interface GeneralSettingsProps {
  config: GuildConfigDto;
  setConfig: React.Dispatch<React.SetStateAction<GuildConfigDto>>;
  parsedGuilds: Item[];
  changeEvent: IOnDropDownChange;
}

export function GeneralSettings({
  config,
  parsedGuilds,
  changeEvent,
  setConfig,
}: GeneralSettingsProps) {
  return (
    <SettingsContainer id="GeneralSettings">
      <h1>General</h1>

      <StyledSpan>Payment Config</StyledSpan>
      <DropDown items={parsedGuilds} onChange={changeEvent} />

      <InputBox
        message="Bot Image URL"
        value={config.embedImageUrl}
        onChange={(e) => {
          setConfig({
            ...config,
            embedImageUrl: e.target.value,
          });
        }}
      />

      <SwitchToggle
        message="Advanced User Switcher"
        toggled={config.autoSwitcher}
        onToggle={() => {
          setConfig({
            ...config,
            autoSwitcher: !config.autoSwitcher,
          });
        }}
      />

      <SwitchToggle
        message="Auto Create Ticket"
        toggled={config.autoTicket}
        onToggle={() => {
          setConfig({
            ...config,
            autoTicket: !config.autoTicket,
          });
        }}
      />

      <SwitchToggle
        message="Auto Reacter"
        toggled={config.autoReact}
        onToggle={() => {
          setConfig({
            ...config,
            autoReact: !config.autoReact,
          });
        }}
      />
    </SettingsContainer>
  );
}

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
  margin-bottom: 5px;
`;
