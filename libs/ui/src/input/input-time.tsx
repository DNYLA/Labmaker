import { useState } from 'react';
import styled from 'styled-components';
import { InfoTitle, DropDown, Item } from './../';

export interface IOnTimeChange {
  // Also passing whole dateTime obj back incase it is needed
  (event: { time: number; dateTime: Date }): void;
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

function getDropDownValues() {
  const hourVals: Item[] = Array.from(
    { length: uses24Hour() ? 24 : 12 },
    (e, i) => {
      return { value: i, label: `${i}` };
    }
  );

  const minuteVals: Item[] = Array.from({ length: 60 }, (e, i) => {
    return { value: i, label: `${i}` };
  });

  const amorpmVals: Item[] = [
    {
      value: 'am',
      label: 'AM',
    },
    {
      value: 'pm',
      label: 'PM',
    },
  ];

  return { hourVals, minuteVals, amorpmVals };
}

export function InputTime({ message, onChange }: TimeProps) {
  const { hourVals, minuteVals, amorpmVals } = getDropDownValues();

  const [time, setTime] = useState<Date>(new Date(0, 0, 0, 0, 0, 0));
  let amorpm: 'am' | 'pm' = 'am';

  const handleTimeUpdate = (type: 'hour' | 'minute' | 'amorpm', e: number) => {
    if (type === 'hour') {
      time.setHours(Number(e));
    } else if (type === 'minute') {
      time.setMinutes(Number(e));
    }

    if (amorpm.toLowerCase() === 'pm') {
      time.setHours(time.getHours() + 12);
    }

    // Only set hours back 12 if amorpm dropdown was changed to `am`.
    // Avoids bug where time is set back 12 hours.
    if (type === 'amorpm' && amorpm.toLowerCase() === 'am') {
      time.setHours(time.getHours() - 12);
    }

    onChange({ time: time.getTime() / 1000, dateTime: time });
  };

  return (
    <StyledTimeContainer>
      {message && <InfoTitle title={message} />}

      <StyledTimeWrapper>
        <DropDown
          items={hourVals}
          value={time.getHours()}
          onChange={(e) => handleTimeUpdate('hour', Number(e))}
        ></DropDown>

        <DropDown
          items={minuteVals}
          value={time.getMinutes()}
          onChange={(e) => handleTimeUpdate('minute', Number(e))}
        ></DropDown>

        {!uses24Hour() && (
          <DropDown
            items={amorpmVals}
            value={amorpm}
            onChange={(e) => {
              amorpm = e as 'am' | 'pm';
              handleTimeUpdate('amorpm', 0); // Just pass 0, wont be used
            }}
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
