import { TicketContainer } from './ticket';
import styled from 'styled-components';
import { Ticket, Tickets, TicketAction } from '@labmaker/shared';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { deleteTicket, updateTicket, UserRole } from '@labmaker/wrapper';
import {
  Button,
  ButtonContainer,
  InputBox,
  InputDate,
  InputTime,
  ModalPopup,
  SwitchToggle,
  TextArea,
} from '@labmaker/ui';
import {
  ConvertEdu,
  ConvertSbj,
  ConvertType,
  getServerId,
} from '../../utils/helpers';
import { useState } from 'react';
import { toast } from 'react-toastify';

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
  const ticketLength = () => tickets.active.length + tickets.completed.length;
  const [modalShown, setModalShown] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(); // Active ticket for modal
  const isStudent = user.role === UserRole.USER ? true : false;

  const renderModal = () => {
    if (activeTicket) {
      const handleResign = async () => {
        //Force Reload data from API || Locally Delete Ticket
        try {
          const id = getServerId();
          await updateTicket(id, activeTicket.id, TicketAction.Resign);
          setModalShown(false);
          setRefresh(!refresh);
          toast.success('Sucessfully resigned from Job');
        } catch (err) {
          console.log(err);
          toast.success(
            'An Error Occured Whilst trying to resign! Contact an Admin if the problem persists'
          );
        }
      };

      const handleGoToChannel = () => {
        //Redirect User to Discord Channel in New Tab
        console.log('Redirecting to Discord Channel in New Tab');
        if (!activeTicket.tutorId)
          toast.info(
            `A tutor has to accept your ticket before you can go to it's channel.`
          );
        else if (!activeTicket.channelId)
          toast.info("Woah Slow down, channel hasn't been created yet.");
        else {
          const id = getServerId();
          window.open(
            `https://discord.com/channels/${id}/${activeTicket.channelId}`
          );
        }
      };

      const handleDelete = async () => {
        try {
          console.log('Deleting');
          const id = getServerId();
          await deleteTicket(id, activeTicket.id);
          setModalShown(false);
          setRefresh(!refresh);
          toast.success(`Deleted Ticket ${activeTicket.id}`);
        } catch (err) {
          toast.error(`Unable to delete Ticket ${activeTicket.id}`);
          console.log(err);
          //Show Notification "Unable to delete ticket if this persists contact an adminisrator"
        }
      };

      return (
        <ModalPopup
          title={`Ticket ${activeTicket.id}`}
          open={modalShown}
          setOpen={setModalShown}
        >
          <InputBox
            message="Type"
            value={ConvertType(activeTicket.type)}
            disabled={true}
          />

          <InputBox
            message="Subject"
            value={ConvertSbj(activeTicket.subject)}
            disabled={true}
          />

          <InputBox
            message="Education"
            value={ConvertEdu(activeTicket.education)}
            disabled={true}
          />

          <InputBox
            message="Budget"
            value={activeTicket.budget.toString()}
            prefix={'$'}
            type={'number'}
            disabled={true}
          />

          {/* <InputDate message="Due Date" value={dueDateObj} /> */}

          {/* Doesnt Work Update to InputBox Or Fix (Input Box Probably Better) */}
          {/* <InputTime message="Due Time" value={dueDateObj} /> */}

          <TextArea
            message="Additional Info"
            value={activeTicket.additionalInfo}
            disabled={true}
          />

          <SwitchToggle
            toggled={activeTicket.paid}
            onToggle={() => console.log('x')}
            message={'Paid'}
          />

          <SwitchToggle
            toggled={activeTicket.completed}
            onToggle={() => console.log('x')}
            message={'Completed'}
          />

          <ButtonContainer>
            <Button onClick={isStudent ? handleDelete : handleResign}>
              {isStudent ? 'Delete' : 'Resign'}
            </Button>

            <Button onClick={handleGoToChannel}>Channel</Button>
          </ButtonContainer>
        </ModalPopup>
      );
    }

    return null;
  };

  return (
    <StyledTickets>
      {ticketLength() === 0 && (
        <Button onClick={user.role === UserRole.USER ? createEvent : findEvent}>
          {user.role === UserRole.USER ? 'Create Ticket' : 'Find Work'}
        </Button>
      )}

      {activeTicket && renderModal()}

      {tickets.active.length > 0 && (
        <>
          <h1>Active: </h1>
          <TicketWrapper>
            {tickets.active.map((ticket) => {
              return (
                <TicketContainer
                  subject={ConvertSbj(ticket.subject)}
                  type={ConvertType(ticket.type)}
                  budget={ticket.budget}
                  due={ticket.due}
                  onClick={() => {
                    setActiveTicket(ticket);
                    setModalShown(true);
                  }}
                />
              );
            })}
          </TicketWrapper>
        </>
      )}

      {tickets.completed.length > 0 && (
        <>
          <h1>Completed: </h1>
          <TicketWrapper>
            {tickets.completed.map((ticket) => {
              return (
                <TicketContainer
                  subject={ConvertSbj(ticket.subject)}
                  type={ConvertType(ticket.type)}
                  budget={ticket.budget}
                  due={ticket.due}
                  onClick={() => {
                    setActiveTicket(ticket);
                    setModalShown(true);
                  }}
                />
              );
            })}
          </TicketWrapper>
        </>
      )}
    </StyledTickets>
  );
}

const StyledTickets = styled.div`
  /* text-align: center; */
  /* display: flex; */
  width: 100%;
`;

const TicketWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  /* justify-content: center; */
  margin: 15px 0px;
  width: 100%;

  /* @media (max-width: 800px) {
    flex-flow: column nowrap;
  } */
`;
