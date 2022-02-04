import styled from 'styled-components';
import {
  DropDown,
  InfoTitle,
  InputBox,
  SettingsContainer,
  SwitchToggle,
} from '@labmaker/ui';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';

enum InfoType {
  New,
  Accepted,
  Deleted,
}
/* eslint-disable-next-line */
export interface TicketMessageProps {
  // config: configDto;
  // setConfig: React.Dispatch<React.SetStateAction<configDto>>;
  // parsedGuilds: Item[];
  // changeEvent: IOnDropDownChange;
}

const LinkSpan = styled.span`
  color: aqua;
  :hover {
    cursor: pointer;
  }
`;

export function TicketMessage(props: TicketMessageProps) {
  const { config, setConfig } = useGuildLogic();

  const createInfoMessage = (example: string, type: InfoType) => {
    const handleClick = () => {
      switch (type) {
        case InfoType.New:
          return setConfig({
            ...config,
            newMessage: example,
          });
        case InfoType.Accepted:
          return setConfig({
            ...config,
            acceptedMessage: example,
          });
        case InfoType.Deleted:
          return setConfig({
            ...config,
            deleteMessage: example,
          });
      }
    };

    return (
      <div>
        <span>
          <LinkSpan onClick={handleClick}>Use Example:</LinkSpan> {example}
        </span>
      </div>
    );
  };

  return (
    <SettingsContainer id="GeneralSettings">
      <InfoTitle
        title={'Notification Messages'}
        infoMessage="You can use {}  to decouple values from the ticket."
        header={true}
      />
      {config.id !== '-1' && (
        <div>
          <InputBox
            message="New Ticket Message"
            infoMessage={createInfoMessage(
              'Listing Created {subject} {type} paying $ {budget} {tutor_role}.',
              InfoType.New
            )}
            value={config.newMessage ? config.newMessage : ''}
            onChange={(e) => {
              setConfig({
                ...config,
                newMessage: e.target.value,
              });
            }}
          />
          <InputBox
            message="Ticket Accepted Message"
            infoMessage={createInfoMessage(
              'Welcome {student} Your Tutor is {tutor} discuss your {type} here.',
              InfoType.Accepted
            )}
            value={config.acceptedMessage ? config.acceptedMessage : ''}
            onChange={(e) => {
              setConfig({
                ...config,
                acceptedMessage: e.target.value,
              });
            }}
          />
          <InputBox
            message="Delete/Resign Message"
            infoMessage={createInfoMessage(
              '{admin_role} {sender} has {action} the ticket. {recipient} has been Notified, close Ticket once verified.',
              InfoType.Deleted
            )}
            value={config.deleteMessage ? config.deleteMessage : ''}
            onChange={(e) => {
              setConfig({
                ...config,
                deleteMessage: e.target.value,
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
