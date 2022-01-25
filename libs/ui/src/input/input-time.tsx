import { useState } from 'react';
import styled from 'styled-components';
import { InfoTitle, DropDown, Item } from './../';

export interface IOnTimeChange {
  // Also passing whole dateTime obj back incase it is needed
  (date: Date): void;
}

export interface TimeProps {
  message?: string;
  onChange?: IOnTimeChange;
  value: Date;
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

export function InputTime({ message, value, onChange }: TimeProps) {
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
    if (!onChange) return;

    const hm = t.split(':');
    const curTime = value;

    curTime.setHours(amorpm === 'am' ? Number(hm[0]) : Number(hm[0]) + 12);
    curTime.setMinutes(Number(hm[1]));
    curTime.setSeconds(0);
    curTime.setMilliseconds(0);

    onChange(curTime);
  };

  const handleAMPMSwitch = (newVal: 'am' | 'pm') => {
    if (!onChange) return;
    amorpm = newVal;
    const curTime = value;
    if (amorpm === 'pm') curTime.setHours(curTime.getHours() + 12);
    else curTime.setHours(curTime.getHours() - 12);
    curTime.setSeconds(0);
    curTime.setMilliseconds(0);

    onChange(curTime);
  };

  return (
    <StyledTimeContainer>
      {message && <InfoTitle title={message} />}

      <StyledTimeWrapper>
        <DropDown
          items={timeVals}
          value={value.getHours()}
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
