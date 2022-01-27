import { Content, LoadingSpinner, Page } from '@labmaker/ui';
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

  const navigate = useNavigate();
  const handleCreate = () => navigate('/create');
  const handleFind = () => navigate('/tutor');
  return (
    <Page>
      <LoadingSpinner loading={loading} message="Loading Tickets" />
      <Section>
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
          <>
            <h1>You Don't have Any Previous Tickets!</h1>
            <p>
              Dont worry, we've made the process super simple, just click below
              to get started.
            </p>
            <Button
              onClick={user.role === UserRole.USER ? handleCreate : handleFind}
            >
              {user.role === UserRole.USER ? 'Create Ticket' : 'Find Work'}
            </Button>
          </>
        )}
      </Section>
    </Page>
  );
}

const Section = styled(Content)`
  /* width: 200vh; */
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  cursor: pointer;
  margin-top: 10px;
  background-color: ${(p) => p.theme.input.backCol};
  color: #fff;
  font-size: 20px;
  font-family: 'Archivo Black', 'Roboto', sans-serif;
  width: fit-content;
  padding: 0px 15px;
  border: none;
  border-radius: 4px;
  :hover {
    background-color: #1a1a1a;
  }
`;
