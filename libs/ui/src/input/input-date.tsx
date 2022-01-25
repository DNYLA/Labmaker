import { useEffect } from 'react';
import styled from 'styled-components';
import { InfoTitle } from './info-box';

export interface IOnDateChange {
  (date: Date): void;
}

export interface DateProps {
  message?: string;
  onChange?: IOnDateChange;
  value: Date;
}

export function InputDate({ message, onChange, value }: DateProps) {
  const d = new Date(Date.now());
  const minDate = d.toISOString().split('T')[0];
  d.setFullYear(d.getFullYear() + 2);
  const maxDate = d.toISOString().split('T')[0];
  const wlz = (n: number) => (n <= 9 ? `0${n}` : n);

  const convertToDate = (d: Date) => {
    const yyyy = wlz(d.getFullYear());
    const mm = wlz(d.getMonth() + 1);
    const dd = wlz(d.getDate());

    return `${yyyy}-${mm}-${dd}`;
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.valueAsDate;
    const dueDate = value;

    if (d) {
      dueDate.setMonth(d.getMonth());
      dueDate.setDate(d.getDate());
      dueDate.setFullYear(d.getFullYear());
      if (onChange) onChange(dueDate);
    }
  };

  return (
    <StyledDateContainer>
      {message ? <InfoTitle title={message} /> : null}
      <StyledDate
        type="date"
        onChange={onDateChange}
        min={minDate}
        max={maxDate}
        value={convertToDate(value)}
      />
    </StyledDateContainer>
  );
}

const StyledDateContainer = styled.div`
  width: 100%;
`;

const StyledDate = styled.input`
  padding: 0 10px;
  margin-top: 5px;
  width: 100%;
  height: 30px;
  color: white;
  background-color: ${(p) => p.theme.input.backCol};
  outline: 0;
  border: 0;
  border-radius: 5px;
  font-family: 'Roboto';
  transition: background-color 250ms ease-in-out;

  &:focus {
    background-color: ${(p) => p.theme.input.activeCol};
  }

  // Make chrome calendar picker icon white by inverting color.
  // Using color doesn't work.. but this does for some reason.
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;
