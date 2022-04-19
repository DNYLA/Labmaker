import { TicketContainer } from './ticket';
import styled from 'styled-components';
import { Ticket, Tickets, TicketAction, PartialTicket } from '@labmaker/shared';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { deleteTicket, updateTicket, UserRole } from '@labmaker/wrapper';
import {
  Button,
  ButtonContainer,
  CenteredText,
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

interface TicketsListProps<T> {
  tickets: T;
  createEvent?: () => void; //Prop Drill create event because its pointless re-writing it inside here
  findEvent?: () => void;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

function useInitList() {
  const user = useSelector((state: RootState) => state.user.value);
  const [modalShown, setModalShown] = useState(false);
  const [activeTicket, setActiveTicket] = useState<
    Ticket | PartialTicket | null
  >(); // Active ticket for modal
  const isStudent = user.role === UserRole.USER ? true : false;

  return {
    user,
    modalShown,
    setModalShown,
    activeTicket,
    setActiveTicket,
    isStudent,
  };
}

export default function TicketsList({
  tickets,
  createEvent,
  findEvent,
  refresh,
  setRefresh,
}: TicketsListProps<Tickets>) {
  const {
    user,
    modalShown,
    setModalShown,
    activeTicket,
    setActiveTicket,
    isStudent,
  } = useInitList();
  const ticketLength = () => tickets.active.length + tickets.completed.length;

  return (
    <StyledTickets>
      {ticketLength() === 0 && (
        <Button onClick={user.role === UserRole.USER ? createEvent : findEvent}>
          {user.role === UserRole.USER ? 'Create Ticket' : 'Find Work'}
        </Button>
      )}

      {activeTicket &&
        renderModal(
          activeTicket,
          setModalShown,
          modalShown,
          setRefresh,
          refresh,
          isStudent
        )}

      {tickets.active.length > 0 && (
        <>
          <h1>Active: </h1>
          <p>Tickets that are still being worked on for you.</p>

          <TicketWrapper>
            {tickets.active.map((ticket) => {
              return (
                <TicketContainer
                  key={ticket.id}
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
          <p>Tickets that have been completed for you in the past</p>

          <TicketWrapper>
            {tickets.completed.map((ticket) => {
              return (
                <TicketContainer
                  key={ticket.id}
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

/**
 * For tutor page.
 * Shows tickets up for grabs to tutors.
 */
export function TutorTicketsList({
  tickets,
  refresh,
  setRefresh,
}: TicketsListProps<PartialTicket[]>) {
  const {
    user,
    modalShown,
    setModalShown,
    activeTicket,
    setActiveTicket,
    isStudent,
  } = useInitList();

  return (
    <StyledTickets>
      {tickets.length === 0 ? (
        <CenteredText>
          <h1>There Are No Tickets Available</h1>
          <p>Make sure to check back for when there are tickets!</p>
        </CenteredText>
      ) : (
        <>
          <h1>Tickets Available: </h1>

          <p>Select tickets that interest you and accept them to work!</p>
        </>
      )}

      {activeTicket &&
        renderModal(
          activeTicket,
          setModalShown,
          modalShown,
          setRefresh,
          refresh,
          isStudent
        )}

      {tickets.length > 0 && (
        <TicketWrapper>
          {tickets.map((ticket) => {
            return (
              <TicketContainer
                key={ticket.id}
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
      )}
    </StyledTickets>
  );
}

function renderModal(
  activeTicket: Ticket | PartialTicket,
  setModalShown: React.Dispatch<React.SetStateAction<boolean>>,
  modalShown: boolean,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  refresh: boolean,
  isStudent: boolean
) {
  // If activeTicket is of type Ticket, not PartialTicket.
  // **If is of type PartialTicket, then we can assume we are on the Tutor page for now.**
  const isTicket = (at: Ticket | PartialTicket): at is Ticket => {
    return (at as Ticket).paid !== undefined;
  };

  console.log('activeTICKET', activeTicket);

  if (activeTicket) {
    console.log('isticket?', isTicket(activeTicket));

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
      if (isTicket(activeTicket)) {
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

    const handleTutorAccept = async () => {
      //Force Reload data from API || Locally Delete Ticket
      try {
        const id = getServerId();
        await updateTicket(id, activeTicket.id, TicketAction.Accept);
        setModalShown(false);
        setRefresh(!refresh);
        toast.success(
          'Succesfully Accepted Job!. Check The Discord Server to talk with the student.'
        );
      } catch (err: any) {
        let message = 'Unable to Accept Job';
        if (err.response.status === 409) {
          message = 'Job Already Accepted By Another User';
        }
        toast.error(message);
        setModalShown(false);
        setRefresh(!refresh);
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

        {isTicket(activeTicket) && (
          <>
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
          </>
        )}

        <ButtonContainer>
          {isTicket(activeTicket) ? (
            <>
              <Button onClick={isStudent ? handleDelete : handleResign}>
                {isStudent ? 'Delete' : 'Resign'}
              </Button>

              <Button onClick={handleGoToChannel}>Channel</Button>
            </>
          ) : (
            <Button onClick={handleTutorAccept}>Accept</Button>
          )}
        </ButtonContainer>
      </ModalPopup>
    );
  }

  return null;
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
