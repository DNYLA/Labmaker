import { Content, LoadingSpinner, Page } from '@labmaker/ui';
import { useFetchActiveTickets } from '../../utils/hooks/useFetchActiveTickets';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { TutorTicketsList } from '../Tickets/tickets-list';

/* eslint-disable-next-line */
export interface TutorProps {}

export function Tutor(props: TutorProps) {
  const { tickets, loading, refresh, setRefresh, error } =
    useFetchActiveTickets();

  return (
    <Page>
      <LoadingSpinner loading={loading} message="Loading Tickets" />
      <Content>
        <TutorTicketsList
          tickets={tickets}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </Content>
    </Page>
  );
}

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
