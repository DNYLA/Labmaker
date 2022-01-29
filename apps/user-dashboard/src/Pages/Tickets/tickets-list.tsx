import { TicketModal } from './ticket';
import styled from 'styled-components';
import { Tickets } from '@labmaker/shared';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserRole } from '@labmaker/wrapper';
import { Button } from '@labmaker/ui';

interface TicketsListProps {
  tickets: Tickets;
  createEvent: () => void; //Prop Drill create event because its pointless re-writing it inside here
  findEvent: () => void;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TicketsList({
  tickets,
  createEvent,
  findEvent,
  refresh,
  setRefresh,
}: TicketsListProps) {
  const user = useSelector((state: RootState) => state.user.value);
  return (
    <StyledTickets>
      <Button onClick={user.role === UserRole.USER ? createEvent : findEvent}>
        {user.role === UserRole.USER ? 'Create Ticket' : 'Find Work'}
      </Button>

      {/* Center This */}
      {tickets.active.length > 0 && (
        <>
          <h1>Active: </h1>
          <TicketContainer>
            {tickets.active.map((ticket) => {
              return (
                <TicketModal
                  key={ticket.id}
                  ticket={ticket}
                  student={user.role === UserRole.USER ? true : false}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              );
            })}
          </TicketContainer>
        </>
      )}

      {/* Center This */}
      {tickets.completed.length > 0 && (
        <>
          <h1>Completed: </h1>
          <TicketContainer>
            {tickets.completed.map((ticket) => {
              return (
                <TicketModal
                  key={ticket.id}
                  ticket={ticket}
                  student={user.role === UserRole.USER ? true : false}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              );
            })}
          </TicketContainer>
        </>
      )}
    </StyledTickets>
  );
}

const StyledTickets = styled.div`
  text-align: center;
  /* display: flex; */
`;

const TicketContainer = styled.div`
  display: flex;
  /* flex-direction: row; */
  flex-flow: row wrap;
  /* flex: wrap; */
  justify-content: center;
  user-select: none;
  max-width: 80%;
  max-height: 1000px;
  margin: 15px 0px;
  /* overflow: scroll; */
`;
