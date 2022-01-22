import { TicketDto } from '@labmaker/wrapper';
import React from 'react';
import styled from 'styled-components';

interface TicketsListProps {
  tickets: TicketDto[];
}

export default function TicketsList({ tickets }: TicketsListProps) {
  return (
    <StyledTickets>
      {tickets.map((ticket) => {
        return (
          <Ticket>
            <h4>
              {ticket.subject} - {ticket.type}
            </h4>
            <h4>${ticket.budget}</h4>
            <h4>{ticket.due}</h4>
          </Ticket>
        );
      })}
    </StyledTickets>
  );
}

const StyledTickets = styled.div`
  display: flex;
  user-select: none;
`;

const Ticket = styled.div`
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
