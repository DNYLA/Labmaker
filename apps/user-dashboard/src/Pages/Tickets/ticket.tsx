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
import { Ticket, TicketAction } from '@labmaker/shared';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ConvertType,
  ConvertEdu,
  ConvertSbj,
  getServerId,
} from '../../utils/helpers';
import { deleteTicket, updateTicket } from '@labmaker/wrapper';
import { useNavigate } from 'react-router-dom';
import { useNavigationType } from 'react-router';
import { toast } from 'react-toastify';

interface TicketContainerProps {
  subject: string;
  type: string;
  budget: number;
  due: Date;
}

interface TicketModalProps {
  ticket: Ticket;
  student: boolean;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TicketContainer({
  subject,
  type,
  budget,
  due,
}: TicketContainerProps) {
  return (
    <TicketContainerStyle>
      <h4>
        {subject} - {type}
      </h4>
      <h4>${budget}</h4>
      <h4>{moment(due, 'YYYYMMDD').toNow(true)}</h4>
    </TicketContainerStyle>
  );
}

export function TicketModal({
  ticket,
  student,
  refresh,
  setRefresh,
}: TicketModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    id,
    subject,
    type,
    budget,
    due,
    education,
    paid,
    completed,
    additionalInfo,
  } = ticket;
  const [dueDateObj, setDueDate] = useState(due);
  useEffect(() => {
    setDueDate(new Date(due));
  }, [due]);

  const handleResign = async () => {
    //Force Reload data from API || Locally Delete Ticket
    try {
      const id = getServerId();
      await updateTicket(id, ticket.id, TicketAction.Resign);
      setIsOpen(false);
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
    if (!ticket.tutorId)
      toast.info(
        `A tutor has to accept your ticket before you can go to it's channel.`
      );
    else if (!ticket.channelId)
      toast.info("Woah Slow down, channel hasn't been created yet.");
    else {
      const id = getServerId();
      window.open(`https://discord.com/channels/${id}/${ticket.channelId}`);
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting');
      const id = getServerId();
      await deleteTicket(id, ticket.id);
      setIsOpen(false);
      setRefresh(!refresh);
      toast.success(`Deleted Ticket ${ticket.id}`);
    } catch (err) {
      toast.error(`Unable to delete Ticket ${ticket.id}`);
      console.log(err);
      //Show Notification "Unable to delete ticket if this persists contact an adminisrator"
    }
  };

  return (
    <ModalPopup
      title={`Ticket ${id}`}
      open={isOpen}
      setOpen={setIsOpen}
      design={
        <TicketContainer
          subject={ConvertSbj(subject)}
          type={ConvertType(type)}
          budget={budget}
          due={due}
        />
      }
    >
      <InputBox message="Type" value={ConvertType(type)} disabled={true} />

      <InputBox message="Subject" value={ConvertSbj(subject)} disabled={true} />

      <InputBox
        message="Education"
        value={ConvertEdu(education)}
        disabled={true}
      />

      <InputBox
        message="Budget"
        value={budget.toString()}
        prefix={'$'}
        type={'number'}
        disabled={true}
      />

      <InputDate message="Due Date" value={dueDateObj} />

      {/* Doesnt Work Update to InputBox Or Fix (Input Box Probably Better) */}
      <InputTime message="Due Time" value={dueDateObj} />

      <TextArea
        message="Additional Info"
        value={additionalInfo}
        disabled={true}
      />

      <SwitchToggle
        toggled={paid}
        onToggle={() => console.log('x')}
        message={'Paid'}
      />

      <SwitchToggle
        toggled={completed}
        onToggle={() => console.log('x')}
        message={'Completed'}
      />

      <ButtonContainer>
        <Button onClick={student ? handleDelete : handleResign}>
          {student ? 'Delete' : 'Resign'}
        </Button>

        <Button onClick={handleGoToChannel}>Channel</Button>
      </ButtonContainer>
    </ModalPopup>
  );
}

const TicketContainerStyle = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 250px;
  height: 100px;
  background-color: ${(p) => p.theme.input.backCol};
  padding: 10px;
  flex-grow: 1;
  margin: 10px;

  &:hover {
    background-color: ${(p) => p.theme.input.activeCol};
  }
`;
