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

export function InputTime({ message, onChange }: TimeProps) {
  const [time, setTime] = useState<Date>(new Date(0, 0, 0, 0, 0, 0));
  let amorpm: 'am' | 'pm' = 'am';

  // Add leading zero if number is smaller than or equal to 9
  const wlz = (n: number) => (n <= 9 ? `0${n}` : n);

  const timeVals: Item[] = [];
  const timeValsN = uses24Hour() ? 24 : 12;
  for (let i = 0; i < timeValsN; i++) {
    timeVals.push(
      ...[
        {
          value: `${wlz(i)}:00`,
          label: `${wlz(i)}:00`,
        },
        {
          value: `${wlz(i)}:30`,
          label: `${wlz(i)}:30`,
        },
      ]
    );
  }

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

  const handleTimeUpdate = (t: string) => {
    const hm = t.split(':');

    time.setHours(amorpm === 'am' ? Number(hm[0]) : Number(hm[0]) + 12);
    time.setMinutes(Number(hm[1]));

    onChange({ time: time.getTime() / 1000, dateTime: time });
  };

  const handleAMPMSwitch = (newVal: 'am' | 'pm') => {
    amorpm = newVal;

    if (amorpm === 'pm') time.setHours(time.getHours() + 12);
    else time.setHours(time.getHours() - 12);

    onChange({ time: time.getTime() / 1000, dateTime: time });
  };

  return (
    <StyledTimeContainer>
      {message && <InfoTitle title={message} />}

      <StyledTimeWrapper>
        <DropDown
          items={timeVals}
          value={time.getHours()}
          onChange={(e) => handleTimeUpdate(String(e))}
        ></DropDown>

        {!uses24Hour() && (
          <DropDown
            items={amorpmVals}
            value={amorpm}
            onChange={(e) => {
              handleAMPMSwitch(e as 'am' | 'pm');
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
