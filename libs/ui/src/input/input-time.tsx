import styled from 'styled-components';
import { InfoTitle, DropDown, Item } from './../';

export interface IOnTimeChange {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}

export interface TimeProps {
  message?: string;
  onChange: IOnTimeChange;
}

function uses24Hour() {
  return (
    // If 'dayPeriod' is undefined, then 24 hour format is used.
    // undefined, meaning users current locale.
    new Intl.DateTimeFormat(undefined, { hour: 'numeric' })
      .formatToParts(new Date())
      .find((e) => e.type === 'dayPeriod') === undefined
  );
}

export function InputTime({ message, onChange }: TimeProps) {
  const hours: Item[] = Array.from(
    { length: uses24Hour() ? 24 : 12 },
    (e, i) => {
      return { value: i, label: `${i}` };
    }
  );

  const minutes: Item[] = Array.from({ length: 60 }, (e, i) => {
    return { value: i, label: `${i}` };
  });

  const amorpm: Item[] = [
    {
      value: 'pm',
      label: 'PM',
    },
    {
      value: 'am',
      label: 'AM',
    },
  ];

  return (
    <StyledTimeContainer>
      {message && <InfoTitle title={message} />}

      <StyledTimeWrapper>
        <DropDown
          items={hours}
          value={0}
          onChange={(e) => console.log(e)}
        ></DropDown>

        <DropDown
          items={minutes}
          value={0}
          onChange={(e) => console.log(e)}
        ></DropDown>

        {!uses24Hour() && (
          <DropDown
            items={amorpm}
            value={'am'}
            onChange={(e) => console.log(e)}
          ></DropDown>
        )}
      </StyledTimeWrapper>
    </StyledTimeContainer>
  );
}

const StyledTimeContainer = styled.div`
  width: 100%;
`;

const StyledTimeWrapper = styled.div`
  display: flex;
  position: relative;
  margin-top: 5px;

  & > div:not(:last-of-type) {
    margin-right: 15px;
  }
`;
