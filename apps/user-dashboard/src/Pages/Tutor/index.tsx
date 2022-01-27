import { Content, LoadingSpinner, Page } from '@labmaker/ui';
import { useFetchActiveTickets } from '../../utils/hooks/useFetchActiveTickets';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { PartialTicketModal } from '../Tickets/partial-ticket-modal';

/* eslint-disable-next-line */
export interface TutorProps {}

export function Tutor(props: TutorProps) {
  const { tickets, loading, refresh, setRefresh, error } =
    useFetchActiveTickets();
  return (
    <Page>
      <LoadingSpinner loading={loading} message="Loading Tickets" />
      <Content>
        {tickets.length > 0 && (
          <TicketContainer>
            {tickets.map((ticket) => {
              return (
                <PartialTicketModal
                  key={ticket.id}
                  ticket={ticket}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              );
            })}
          </TicketContainer>
        )}
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
