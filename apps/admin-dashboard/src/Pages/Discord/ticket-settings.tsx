import styled from 'styled-components';
import {
  DropDown,
  InputBox,
  SettingsContainer,
  SwitchToggle,
} from '@labmaker/ui';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';

/* eslint-disable-next-line */
export interface TicketSettingsProps {
  // config: GuildConfigDto;
  // setConfig: React.Dispatch<React.SetStateAction<GuildConfigDto>>;
  // parsedGuilds: Item[];
  // changeEvent: IOnDropDownChange;
}

export function TicketSettings(props: TicketSettingsProps) {
  const { guildConfig, parsedGuilds, onConfigIdChanged, setConfig } =
    useGuildLogic();
  return (
    <SettingsContainer id="GeneralSettings">
      <h1>Ticket</h1>

      {guildConfig.id !== '-1' && (
        <div>
          <InputBox
            message="Orders Category"
            value={'Open Orders'}
            // onChange={(e) => {
            //   setConfig({
            //     ...guildConfig,
            //     prefix: e.target.value,
            //   });
            // }}
          />
          <InputBox
            message="Ticket Channel Name"
            value={'Ticket-{id}'}
            // onChange={(e) => {
            //   setConfig({
            //     ...guildConfig,
            //     prefix: e.target.value,
            //   });
            // }}
          />
          <InputBox
            message="Notification Channel"
            value={'Tutor Notifications'}
            // onChange={(e) => {
            //   setConfig({
            //     ...guildConfig,
            //     prefix: e.target.value,
            //   });
            // }}
          />
          <SwitchToggle
            message="Hide Channel on Delete"
            toggled={guildConfig.autoSwitcher}
            onToggle={() => {
              setConfig({
                ...guildConfig,
                autoSwitcher: !guildConfig.autoSwitcher,
              });
            }}
          />
          <SwitchToggle
            message="Notify on Delete"
            toggled={guildConfig.autoSwitcher}
            onToggle={() => {
              setConfig({
                ...guildConfig,
                autoSwitcher: !guildConfig.autoSwitcher,
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
