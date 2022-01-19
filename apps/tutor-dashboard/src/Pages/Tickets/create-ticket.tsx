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
import { useState } from 'react';
import styled from 'styled-components';
/* eslint-disable-next-line */
export interface IndexProps {}

export function CreateTicket(props: IndexProps) {
  const [textAreaInput, setTextAreaInput] = useState('Enter Additional Info');
  const [rangeVal, setRangeVal] = useState(10);

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
          <DropDownContainer>
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
          </DropDownContainer>
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
          <InputBox
            message="Date"
            value={'Convert Into Date Time Picker'}
            onChange={(e) => console.log(e)}
          />
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
