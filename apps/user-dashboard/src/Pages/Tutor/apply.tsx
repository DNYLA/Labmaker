import {
  Content,
  DropDown,
  InfoTitle,
  InputBox,
  InputDate,
  InputRange,
  InputTime,
  Item,
  MultiSelect,
  Page,
  SettingsContainer,
  TextArea,
} from '@labmaker/ui';
import {
  createApplication,
  createTicket,
  getCanApply,
} from '@labmaker/wrapper';
import { RootState } from '../../store';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { error } from 'console';
import { typeItems, subjectItems, educationItems } from '../../utils/static';
import { useNavigate } from 'react-router-dom';
import { CreateApplication, Subjects } from '@labmaker/shared';
import { getEnumKeyByEnumValue, getServerId } from '../../utils/helpers';

/* eslint-disable-next-line */
export interface ApplyTutor {}

const defaultApplication: CreateApplication = {
  applicationMessage: '',
  vouchesLink: '',
  subjects: [],
};

export function ApplyTutorPage(props: ApplyTutor) {
  const [application, setApplication] =
    useState<CreateApplication>(defaultApplication);
  const [canApply, setCanApply] = useState(true);
  const user = useSelector((state: RootState) => state.user.value);
  const navigate = useNavigate();

  useEffect(() => {
    // If user not logged in, don't bother checking if they can apply.
    // The login element will be shown.
    if (user.id === '-1') return;

    const id = getServerId();
    getCanApply(id)
      .then(({ data }) => setCanApply(data))
      .catch((err) => {
        setCanApply(false);
        toast.error(
          'Unable to Load Data. If this continues contact an administrator!'
        );
        console.log(err);
      });
  }, []);

  const handleApply = async () => {
    try {
      const id = getServerId();
      await createApplication(id, application);
      toast.success(
        `Successfully Created Application!. You will be notified once it's been reviewd.`
      );
      navigate('/');
    } catch (err) {
      //Check if Form is filled and Present Seperate Error
      toast.error(
        'Unable to create the Application. If this continues please contact an Administrator'
      );
      console.log(err);
    }
  };

  const onMultiSelectChange = (item: string | number) => {
    if (typeof item === 'number') return;

    const enumKey = getEnumKeyByEnumValue(Subjects, item);

    if (!enumKey) return;
    const enumVal = Subjects[enumKey];

    const curSubjects = [...application.subjects];
    const index = curSubjects.findIndex((sbj) => sbj === enumVal);
    if (index === -1) curSubjects.push(enumVal);
    else curSubjects.splice(index, 1);

    console.log(curSubjects);
    setApplication({ ...application, subjects: curSubjects });
  };

  return (
    <Page>
      <Content>
        {!canApply && (
          <Section>
            <h1>You are Unable to Apply!</h1>
            <p>
              You either have an application in progress or have already applied
              in the past 7 days.
            </p>
            <p>
              If its been over 48 hours since you applied contact an
              Administrator for an update.
            </p>
          </Section>
        )}
        {canApply && (
          <SettingsContainer>
            <InfoTitle
              title={'Create Ticket Form'}
              header={true}
              center={true}
            />
            {/* <FormRow>
            <div>
              <StyledSpan>Type</StyledSpan>
              <DropDown
                items={typeItems}
                value={ticket.type}
                onChange={handleChangeType}
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
          </FormRow> */}
            <InputBox
              message="Username"
              value={`${user.username}#${user.discriminator}`}
              onChange={(e) => console.log(e.target.value)}
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              //   setConfig({ ...config, clientId: e.target.value })
              // }
              disabled={true}
            />
            <TextArea
              message="Experience"
              placeholder="Enter Your Experience"
              value={application.applicationMessage}
              onChange={(e) => {
                setApplication({
                  ...application,
                  applicationMessage: e.target.value,
                });
              }}
              textLimit={300}
            />
            <InputBox
              message="Vouches Evidence"
              infoMessage="Reddit Thread/Post or Discord Server you are apart of. We do not accept image vouches."
              value={application.vouchesLink}
              onChange={(e) =>
                setApplication({ ...application, vouchesLink: e.target.value })
              }
            />
            <InputBox
              message="Reddit Username"
              infoMessage="This is optional but may help boost your chances of getting accepted if you are active on reddit."
              value={application.redditUsername}
              onChange={(e) =>
                setApplication({
                  ...application,
                  redditUsername: e.target.value,
                })
              }
            />
            <div>
              <MultiSelect
                title="Subject"
                infoMessage="If Other is selected specify inside Experience"
                items={subjectItems}
                selected={application.subjects}
                onChange={onMultiSelectChange} // onChange={handleChangeSubject}
              />
            </div>
            <CenterDiv>
              <CustomButton onClick={handleApply}>Apply</CustomButton>
            </CenterDiv>
          </SettingsContainer>
        )}
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

const FormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > *:not(:last-child) {
    margin-right: 15px;
  }
`;

const Section = styled(Content)`
  /* width: 200vh; */
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
