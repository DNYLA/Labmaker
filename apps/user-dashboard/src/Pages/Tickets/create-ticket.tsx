import {
  Content,
  DropDown,
  InfoTitle,
  InputBox,
  InputRange,
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
  const [textAreaInput, setTextAreaInput] = useState('Enter Additional Info');
  const [rangeVal, setRangeVal] = useState(10);
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
      navigate('/');
    } catch (err) {
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

  return (
    <Page>
      <Content>
        <SettingsContainer>
          <InfoTitle title={'Create Ticket Form'} header={true} center={true} />
          <DropDownContainer>
            <div>
              <StyledSpan>Type</StyledSpan>
              <DropDown
                items={typeItems}
                value={ticket.type}
                onChange={handleChangeType}
              />
            </div>
            <div>
              <StyledSpan>Subject</StyledSpan>
              <DropDown
                items={subjectItems}
                value={ticket.subject}
                onChange={handleChangeSubject}
              />
            </div>
            <div>
              <StyledSpan>Education</StyledSpan>
              <DropDown
                items={educationItems}
                value={ticket.education}
                onChange={handleChangeEducation}
              />
            </div>
          </DropDownContainer>
          <InputBox
            message="Username"
            value={`${user.username}#${user.discriminator}`}
            onChange={(e) => console.log(e.target.value)}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setConfig({ ...config, clientId: e.target.value })
            // }
            disabled={true}
          />

          <InputRange
            value={ticket.budget}
            min={50}
            max={500}
            step={10}
            message={'Budget'}
            prefix={'$'}
            onChange={(e) => {
              if (!ticket) return;
              setTicket({ ...ticket, budget: Number(e.target.value) });
            }}
            infoMessage={
              'You and the tutor will still need to negotiate! If your budget is not within the range add your budget to the Additional Notes.'
            }
          />
          <TextArea
            message="Additional Notes"
            value={ticket.additionalInfo ? ticket.additionalInfo : ''}
            onChange={(e) => {
              if (!ticket) return;
              setTicket({ ...ticket, additionalInfo: e.target.value });
            }}
            textLimit={300}
          />
          <InputBox
            message="Date"
            value={'Convert Into Date Time Picker'}
            onChange={(e) => console.log(e)}
          />
          <CenterDiv>
            <CustomButton onClick={handleCreate}>Create</CustomButton>
          </CenterDiv>
        </SettingsContainer>
      </Content>
    </Page>
  );
}

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
  margin-bottom: 5px;
  user-select: none;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const DropDownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* div {
    margin-right: 10px;
  } */
  /* justify-content: center; */
  margin: 0px 50px 10px 50px;
`;

const CustomButton = styled.button`
  width: 50%;
  height: 28px;
  border: none;
  background-color: #313c4b;
  border-radius: 5px;
  justify-content: center;
  color: white;
  font-family: 'Roboto';
  font-size: 18px;
  outline: none;
  transition: 0.5s;

  :active {
    border: none;
  }

  :hover {
    background-color: #455366;
    transition: 0.5s;
    cursor: pointer;
  }
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  button {
    margin-right: 25px;
  }
`;