import styled from 'styled-components';
import { InfoTitle } from './info-box';

export interface IOnDateChange {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}

export interface DateProps {
  message?: string;
  onChange: IOnDateChange;
}

export function InputDate({ message, onChange }: DateProps) {
  return (
    <StyledDateContainer>
      {message ? <InfoTitle title={message} /> : null}
      <StyledDate type="date" onChange={onChange} />
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
