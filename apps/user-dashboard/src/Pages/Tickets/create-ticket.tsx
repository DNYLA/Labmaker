import {
  Button,
  Content,
  DropDown,
  InfoTitle,
  InputBox,
  InputDate,
  InputRange,
  InputTime,
  Item,
  Page,
  SettingsContainer,
  TextArea,
} from '@labmaker/ui';
import { createTicket } from '@labmaker/wrapper';
import { RootState } from '../../store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { error } from 'console';
import { typeItems, subjectItems, educationItems } from '../../utils/static';
import { useNavigate } from 'react-router-dom';
import { CreateTicket } from '@labmaker/shared';

/* eslint-disable-next-line */
export interface IndexProps {}

const defaultTicket: CreateTicket = {
  creatorId: '-1',
  serverId: '0',
  type: 'hwk',
  subject: 'maths',
  education: 'College',
  budget: 50,
  due: new Date(),
  additionalInfo: '',
};

export function CreateTicketPage(props: IndexProps) {
  const [ticket, setTicket] = useState<CreateTicket>(defaultTicket);
  const user = useSelector((state: RootState) => state.user.value);
  const navigate = useNavigate();

  useEffect(() => {
    const serverId = process.env.NX_SERVER_ID;
    if (!serverId) throw EvalError('Unable to locate Server ID');

    setTicket({
      creatorId: user.id,
      serverId: serverId,
      type: typeItems[0].value.toString(),
      subject: subjectItems[0].value.toString(),
      education: educationItems[0].value.toString(),
      budget: 50,
      due: new Date(),
      additionalInfo: '',
    });
  }, [user.id]);

  const handleCreate = async () => {
    if (!ticket) return console.log('Not Filled Out');
    try {
      console.log(ticket);
      await createTicket(ticket);
      toast.success(
        'Successfully created your ticket! You will be notified when a tutor accepts your ticket.'
      );
      navigate('/');
    } catch (err) {
      toast.error(
        'Unable to create ticket. If this continues please contact an Administrator.'
      );
      console.log(err);
    }
  };

  const handleChangeType = (value: number | string) => {
    if (typeof value === 'number') return;
    if (!ticket) return;

    setTicket({ ...ticket, type: value });
  };

  const handleChangeSubject = (value: number | string) => {
    if (typeof value === 'number') return;
    if (!ticket) return;

    setTicket({ ...ticket, subject: value });
  };

  const handleChangeEducation = (value: number | string) => {
    if (typeof value === 'number') return;
    if (!ticket) return;

    setTicket({ ...ticket, education: value });
  };

  const handleTicketInput = (value: number) => {
    if (!ticket) return;
    setTicket({ ...ticket, budget: value });
  };

  return (
    <Page>
      <Content>
        <SettingsContainer>
          <InfoTitle title={'Create Ticket Form'} header={true} center={true} />

          <FormRow>
            <FormRowGroup>
              <DropDown
                title="Type"
                items={typeItems}
                value={ticket.type}
                onChange={handleChangeType}
              />
            </FormRowGroup>

            <FormRowGroup>
              <DropDown
                title="Subject"
                items={subjectItems}
                value={ticket.subject}
                onChange={handleChangeSubject}
              />
            </FormRowGroup>

            <FormRowGroup>
              <DropDown
                title="Education"
                items={educationItems}
                value={ticket.education}
                onChange={handleChangeEducation}
              />
            </FormRowGroup>
          </FormRow>

          <InputBox
            message="Username"
            value={`${user.username}#${user.discriminator}`}
            disabled={true}
          />

          <InputBox
            message="Budget"
            prefix="$"
            value={ticket.budget}
            type="number"
            onChange={(e) => handleTicketInput(Number(e.target.value))}
          />

          <TextArea
            message="Additional Notes"
            placeholder="Enter Additional Info"
            value={ticket.additionalInfo}
            onChange={(e) => {
              if (!ticket) return;
              setTicket({ ...ticket, additionalInfo: e.target.value });
            }}
            textLimit={300}
          />

          <FormRow>
            <InputDate
              message="Due Date"
              value={ticket.due}
              onChange={(e) => setTicket({ ...ticket, due: e })}
            />

            <InputTime
              message="Due Time"
              value={ticket.due}
              onChange={(e) => {
                setTicket({ ...ticket, due: e });
              }}
            />
          </FormRow>

          <CenterDiv>
            <Button onClick={handleCreate}>Create</Button>
          </CenterDiv>
        </SettingsContainer>
      </Content>
    </Page>
  );
}

const FormRowGroup = styled.div`
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  flex-grow: 1;

  & > *:not(:last-child) {
    margin-bottom: 15px;
  }

  @media (min-width: 750px) {
    flex-flow: row;
    justify-content: space-between;

    & > *:not(:last-child) {
      margin-right: 15px;
      margin-bottom: 0;
    }
  }
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;
