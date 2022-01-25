import { InputBox, ModalPopup, SwitchToggle, TextArea } from '@labmaker/ui';
import { TicketDto } from '@labmaker/wrapper';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

interface TicketsListProps {
  tickets: TicketDto[];
}

interface TicketProps {
  subject: string;
  type: string;
  budget: number;
  due: Date;
}

export function Ticket({ subject, type, budget, due }: TicketProps) {
  return (
    <TicketStyle>
      <h4>
        {subject} - {type}
      </h4>
      <h4>${budget}</h4>
      <h4>{moment(due, 'YYYYMMDD').toNow(true)}</h4>
    </TicketStyle>
  );
}

export default function TicketsList({ tickets }: TicketsListProps) {
  return (
    <StyledTickets>
      {tickets.map((t) => {
        return (
          <ModalPopup
            title={`Ticket ${t.id}`}
            design={
              <Ticket
                subject={t.subject}
                type={t.type}
                budget={t.budget}
                due={t.due}
              />
            }
            items={[]}
            onChange={() => console.log('hi')}
          >
            <InputBox message="Type" value={t.type} disabled={true} />
            <InputBox message="Subject" value={t.subject} disabled={true} />
            <InputBox message="Education" value={t.education} disabled={true} />
            <InputBox
              message="Budget"
              value={t.budget.toString()}
              disabled={true}
            />
            <InputBox message="Due" value={t.due.toString()} disabled={true} />
            <TextArea
              message="Additional Info"
              value={t.additionalInfo}
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
              <MenuButton>Resign</MenuButton>
              <MenuButton>Channel</MenuButton>
            </ButtonContainer>
          </ModalPopup>
        );
      })}
    </StyledTickets>
  );
}

const StyledTickets = styled.div`
  display: flex;
  user-select: none;
`;

const TicketStyle = styled.div`
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
