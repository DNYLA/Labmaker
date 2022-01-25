import { InputBox, ModalPopup, SwitchToggle, TextArea } from '@labmaker/ui';
import { TicketDto } from '@labmaker/wrapper';
import { TicketModal } from './ticket';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

interface TicketsListProps {
  tickets: TicketDto[];
}

export default function TicketsList({ tickets }: TicketsListProps) {
  return (
    <StyledTickets>
      {tickets.map((ticket) => {
        return <TicketModal ticket={ticket} />;
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
