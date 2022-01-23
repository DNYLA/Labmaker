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
  InputDate,
  InputTime,
} from '@labmaker/ui';
import { useState } from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface IndexProps {}

export function CreateTicket(props: IndexProps) {
  const [textAreaInput, setTextAreaInput] = useState('Enter Additional Info');
  const [rangeVal, setRangeVal] = useState(10);
  const [dueDate, setDueDate] = useState<Date>(new Date(0, 0, 0, 0, 0, 0));

  const subjectItems: Item[] = [
    { value: 'maths', label: 'Maths' },
    { value: 'compSci', label: 'Computer Science' },
    { value: 'english', label: 'English' },
    { value: 'chem', label: 'Chemistry' },
    { value: 'physics', label: 'Physics' },
    { value: 'bio', label: 'Biology' },
    { value: 'other', label: 'Other' },
  ];

  const typeItems: Item[] = [
    { value: 'exam', label: 'Exam' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'hw', label: 'Homework' },
    { value: 'other', label: 'Other' },
  ];

  const educationItems: Item[] = [
    { value: 'uni', label: 'University' },
    { value: 'college', label: 'College' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Page>
      <Content>
        <SettingsContainer>
          <InfoTitle title={'Create Ticket Form'} header={true} center={true} />

          <FormRow>
            <div>
              <StyledSpan>Type</StyledSpan>
              <DropDown
                items={typeItems}
                value={'Select'}
                onChange={(e) => console.log(e)}
              />
            </div>

            <div>
              <StyledSpan>Subject</StyledSpan>
              <DropDown
                items={subjectItems}
                value={'Select'}
                onChange={(e) => console.log(e)}
              />
            </div>

            <div>
              <StyledSpan>Education</StyledSpan>
              <DropDown
                items={educationItems}
                value={'Select'}
                onChange={(e) => console.log(e)}
              />
            </div>
          </FormRow>

          <InputBox
            message="Username"
            value={'Lamer#001'}
            onChange={(e) => console.log(e)}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setConfig({ ...config, clientId: e.target.value })
            // }
            disabled={true}
          />

          <InputBox
            message="Budget ($)"
            value={''}
            onChange={(e) => console.log(e)}
          />

          <InputRange
            value={rangeVal}
            min={50}
            max={500}
            step={10}
            message={'Budget'}
            prefix={'$'}
            onChange={(e) => setRangeVal(Number(e.target.value))}
            infoMessage={
              'You and the tutor will still need to negotiate! If your budget is not within the range add your budget to the Additional Notes.'
            }
          />

          <TextArea
            message="Additional Notes"
            value={textAreaInput}
            onChange={(e) => setTextAreaInput(e.target.value)}
            textLimit={300}
          />

          <FormRow>
            <InputDate
              message="Due Date"
              onChange={(e) => {
                const d = e.target.valueAsDate;

                if (d) {
                  dueDate.setMonth(d.getMonth());
                  dueDate.setDate(d.getDate());
                  dueDate.setFullYear(d.getFullYear());
                  setDueDate(dueDate);
                }

                console.log(dueDate);
              }}
            />

            <InputTime
              message="Due Time"
              onChange={(e) => {
                const t = e.dateTime;

                if (t) {
                  dueDate.setHours(t.getHours());
                  dueDate.setMinutes(t.getMinutes());
                  setDueDate(dueDate);
                }

                console.log(dueDate);
              }}
            />
          </FormRow>
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

const FormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > *:not(:last-child) {
    margin-right: 15px;
  }
`;
