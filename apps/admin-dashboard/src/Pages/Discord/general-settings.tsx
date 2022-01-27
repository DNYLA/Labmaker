import styled from 'styled-components';
import {
  DropDown,
  InputBox,
  IOnDropDownChange,
  Item,
  SettingsContainer,
  SwitchToggle,
} from '@labmaker/ui';
import { useDispatch } from 'react-redux';
import ReactDropdown from 'react-dropdown';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';

/* eslint-disable-next-line */
export interface GeneralSettingsProps {
  // config: GuildConfigDto;
  // setConfig: React.Dispatch<React.SetStateAction<GuildConfigDto>>;
  // parsedGuilds: Item[];
  // changeEvent: IOnDropDownChange;
}

export function GeneralSettings(props: GeneralSettingsProps) {
  const { guildConfig, parsedGuilds, onConfigIdChanged, setConfig } =
    useGuildLogic();
  return (
    <SettingsContainer id="GeneralSettings">
      <h1>General</h1>

      <StyledSpan>Payment Config</StyledSpan>
      {guildConfig.id !== '-1' && (
        <div>
          <DropDown
            items={parsedGuilds}
            onChange={onConfigIdChanged}
            value={guildConfig.paymentConfigId}
          />

          <InputBox
            message="Bot Image URL"
            value={guildConfig.embedImageUrl}
            onChange={(e) => {
              setConfig({
                ...guildConfig,
                embedImageUrl: e.target.value,
              });
            }}
          />

          <SwitchToggle
            message="Advanced User Switcher"
            toggled={guildConfig.autoSwitcher}
            onToggle={() => {
              setConfig({
                ...guildConfig,
                autoSwitcher: !guildConfig.autoSwitcher,
              });
            }}
          />

          <SwitchToggle
            message="Auto Create Ticket"
            toggled={guildConfig.autoTicket}
            onToggle={() => {
              setConfig({
                ...guildConfig,
                autoTicket: !guildConfig.autoTicket,
              });
            }}
          />

          <SwitchToggle
            message="Auto Reacter"
            toggled={guildConfig.autoReact}
            onToggle={() => {
              setConfig({
                ...guildConfig,
                autoReact: !guildConfig.autoReact,
              });
            }}
          />
        </div>
      )}
    </SettingsContainer>
  );
}

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
  margin-bottom: 5px;
`;
