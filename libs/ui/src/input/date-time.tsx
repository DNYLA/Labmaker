import styled from 'styled-components';
import { InfoTitle } from './info-box';

export interface DateTimeProps {
  message?: string;
}

export function DateTime({ message }: DateTimeProps) {
  return (
    <StyledDateTimeContainer>
      {message ? <InfoTitle title={message} /> : null}
      <StyledDateTime type="date" />
    </StyledDateTimeContainer>
  );
}

const StyledDateTimeContainer = styled.div`
  width: 100%;
`;

const StyledDateTime = styled.input`
  padding: 0 10px;
  margin-top: 5px;
  width: 100%;
  height: 30px;
  color: white;
  background: ${(p) => p.theme.input.backCol};
  outline: 0;
  border: 0;
  border-radius: 5px;
  font-family: 'Roboto';
`;
