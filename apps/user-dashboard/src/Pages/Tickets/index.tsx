import { Button, Content, LoadingSpinner, Page } from '@labmaker/ui';
import { useFetchTickets } from '../../utils/hooks/useFetchTickets';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TicketsList from './tickets-list';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserRole } from '@labmaker/wrapper';

/* eslint-disable-next-line */
export interface IndexProps {}

export function Tickets(props: IndexProps) {
  const { tickets, loading, setRefresh, refresh, error } = useFetchTickets();
  const user = useSelector((state: RootState) => state.user.value);
  const isUser = user.role === UserRole.USER;

  const navigate = useNavigate();
  const handleCreate = () => navigate('/create');
  const handleFind = () => navigate('/tutor');

  return (
    <Page>
      <LoadingSpinner loading={loading} message="Loading Tickets" />

      <Content>
        {!loading &&
        tickets &&
        (tickets.active.length > 0 || tickets.completed.length > 0) ? (
          <TicketsList
            tickets={tickets}
            createEvent={handleCreate}
            findEvent={handleFind}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ) : (
          <StyledInfo>
            <h1>
              {isUser
                ? "You Don't Have Any Previous Tickets!"
                : "You Haven't Worked On Any Tickets Yet!"}
            </h1>
            <p>
              Dont worry, we've made the process super simple, just click below
              to get started.
            </p>
            <Button onClick={isUser ? handleCreate : handleFind}>
              {isUser ? 'Create Ticket' : 'Find Work'}
            </Button>
          </StyledInfo>
        )}
      </Content>
    </Page>
  );
}

const StyledInfo = styled.div`
  text-align: center;

  * {
    margin-bottom: 10px;
  }

  p {
    font-size: 20px;
  }
`;
