import styled from 'styled-components';
import {
  DropDown,
  InputBox,
  SettingsContainer,
  SwitchToggle,
} from '@labmaker/ui';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';

/* eslint-disable-next-line */
export interface TicketMessageProps {
  // config: GuildConfigDto;
  // setConfig: React.Dispatch<React.SetStateAction<GuildConfigDto>>;
  // parsedGuilds: Item[];
  // changeEvent: IOnDropDownChange;
}

export function TicketMessage(props: TicketMessageProps) {
  const { guildConfig, parsedGuilds, onConfigIdChanged, setConfig } =
    useGuildLogic();
  return (
    <SettingsContainer id="GeneralSettings">
      <h1>Notification Messages</h1>

      {guildConfig.id !== '-1' && (
        <div>
          <InputBox
            message="New Ticket Message"
            value={
              'Listing Created {subject} {type} paying $ {budget} {tutor_role}.'
            }
            // onChange={(e) => {
            //   setConfig({
            //     ...guildConfig,
            //     prefix: e.target.value,
            //   });
            // }}
          />
          <InputBox
            message="Ticket Accepted Message"
            value={
              'Welcome {student} Your Tutor is {tutor} discuss your {type} here.'
            }
            // onChange={(e) => {
            //   setConfig({
            //     ...guildConfig,
            //     prefix: e.target.value,
            //   });
            // }}
          />
          <InputBox
            message="Delete/Resign Message"
            value={
              '{admin_role} {student_or_tutor} has {action}. {opposite_of_student_or_tutor} has been Notified, close Ticket once verified.'
            }
            // onChange={(e) => {
            //   setConfig({
            //     ...guildConfig,
            //     prefix: e.target.value,
            //   });
            // }}
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
