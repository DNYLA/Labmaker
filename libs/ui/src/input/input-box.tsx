import { InfoTitle } from './info-box';
import styled from 'styled-components';

export interface IOnInputBoxChange {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}
/* eslint-disable-next-line */
export interface InputBoxProps {
  value: string | string[];
  infoMessage?: string | React.ReactNode;
  message: string;
  onChange?: IOnInputBoxChange;
  disabled?: boolean;
}

export function InputBox({
  message,
  infoMessage,
  value,
  onChange,
  disabled,
}: InputBoxProps) {
  return (
    <StyledInputBox>
      <InfoTitle title={message} infoMessage={infoMessage} />
      <StyledInput
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e);
        }}
        disabled={disabled}
      />
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

  :disabled {
    color: gray;
    user-select: none;
    pointer-events: none;
  }
`;
