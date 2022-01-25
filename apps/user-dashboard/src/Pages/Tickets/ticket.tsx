import { InputBox, ModalPopup, SwitchToggle, TextArea } from '@labmaker/ui';
import { TicketDto } from '@labmaker/wrapper';
import moment from 'moment';
import styled from 'styled-components';

interface TicketContainerProps {
  subject: string;
  type: string;
  budget: number;
  due: Date;
}

interface TicketProps {
  ticket: TicketDto;
}

function TicketContainer({ subject, type, budget, due }: TicketContainerProps) {
  return (
    <TicketContainerStyle>
      <h4>
        {subject} - {type}
      </h4>
      <h4>${budget}</h4>
      <h4>{moment(due, 'YYYYMMDD').toNow(true)}</h4>
    </TicketContainerStyle>
  );
}

export function TicketModal({ ticket }: TicketProps) {
  const { id, subject, type, budget, due, education, additionalInfo } = ticket;

  const handleResign = () => {
    //Call API to Resign Tutor.
    //Force Reload data from API || Locally Delete Ticket
    console.log('Resigning Tutor from Case');
  };

  const handleGoToChannel = () => {
    //Redirect User to Discord Channel in New Tab
    console.log('Redirecting to Discord Channel in New Tab');
  };

  return (
    <ModalPopup
      title={`Ticket ${id}`}
      design={
        <TicketContainer
          subject={subject}
          type={type}
          budget={budget}
          due={due}
        />
      }
      items={[]}
      onChange={() => console.log('hi')}
    >
      <InputBox message="Type" value={type} disabled={true} />
      <InputBox message="Subject" value={subject} disabled={true} />
      <InputBox message="Education" value={education} disabled={true} />
      <InputBox message="Budget" value={budget.toString()} disabled={true} />
      <InputBox message="Due" value={due.toString()} disabled={true} />
      <TextArea
        message="Additional Info"
        value={additionalInfo}
        disabled={true}
      />
      <SwitchToggle
        toggled={true}
        onToggle={() => console.log('x')}
        message={'Paid'}
      />
      <SwitchToggle
        toggled={false}
        onToggle={() => console.log('x')}
        message={'Completed'}
      />
      <ButtonContainer>
        <MenuButton onClick={handleResign}>Resign</MenuButton>
        <MenuButton onClick={handleGoToChannel}>Channel</MenuButton>
      </ButtonContainer>
    </ModalPopup>
  );
}

const TicketContainerStyle = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-right: 10px;
  width: 250px;
  height: 100px;
  background-color: ${(p) => p.theme.input.backCol};
  padding: 10px;

  :hover {
    background-color: ${(p) => p.theme.input.activeCol};
  }
`;

const ButtonContainer = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
`;

const MenuButton = styled.button`
  /* background-color: ${(p) => p.theme.navbar.item}; */
  background-color: #121212;
  color: ${(p) => p.theme.navbar.title};
  font-size: 19px;
  margin-right: 20px;
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  :hover {
    color: ${(p) => p.theme.navbar.active};
  }
`;
