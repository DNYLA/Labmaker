import { TicketModal } from './ticket';
import styled from 'styled-components';
import { Tickets } from '@labmaker/shared';

interface TicketsListProps {
  tickets: Tickets;
}

export default function TicketsList({ tickets }: TicketsListProps) {
  return (
    <StyledTickets>
      {tickets.active.length > 0 && (
        <>
          <h1>Active: </h1>
          <TicketContainer>
            {tickets.active.map((ticket) => {
              return <TicketModal ticket={ticket} />;
            })}
          </TicketContainer>
        </>
      )}
      {tickets.completed.length > 0 && (
        <>
          <h1>Completed: </h1>
          <TicketContainer>
            {tickets.completed.map((ticket) => {
              return <TicketModal ticket={ticket} />;
            })}
          </TicketContainer>
        </>
      )}
    </StyledTickets>
  );
}

const StyledTickets = styled.div`
  text-align: center;
`;

const TicketContainer = styled.div`
  display: flex;
  user-select: none;
`;
