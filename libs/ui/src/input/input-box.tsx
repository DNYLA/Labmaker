import { InfoTitle } from './info-box';
import styled from 'styled-components';

export interface IOnChange {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}
/* eslint-disable-next-line */
export interface InputBoxProps {
  value: string | string[];
  infoMessage?: string;
  message: string;
  onChange: IOnChange;
}

export function InputBox({
  message,
  infoMessage,
  value,
  onChange,
}: InputBoxProps) {
  return (
    <StyledInputBox>
      <InfoTitle
        title={message}
        infoMessage={infoMessage}
        enabled={infoMessage ? true : false}
      />

      <StyledInput value={value} onChange={(e) => onChange(e)} />
    </StyledInputBox>
  );
}

const StyledInputBox = styled.div`
  user-select: none;
`;

const StyledInput = styled.input`
  display: flex;
  padding: 0 10px;
  color: white;
  font-family: 'Roboto';
  width: 100%;
  height: 30px;
  margin-top: 5px;
  background: ${(p) => p.theme.input.backCol};
  border: 2px solid ${(p) => p.theme.input.borderCol};
  border-radius: 5px;
  transition: 340ms;

  :focus {
    opacity: 80%;
    outline: 0;
    transition: 340ms;
  }
`;
