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

const StyledInputBox = styled.div`
  user-select: none;
  /* margin-top: 10px; */
`;

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
      <InputContainer>
        <input value={value} onChange={(e) => onChange(e)} />
      </InputContainer>
    </StyledInputBox>
  );
}

const InputContainer = styled.div`
  display: flex;
  height: 23px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  margin-top: 3px;

  span {
    padding-right: 5px;
  }

  input {
    padding-left: 10px;
    color: white;
    font-family: 'Lexend Deca';
    width: 100%;
    height: 30px;
    background: ${(p) => p.theme.input.backCol};
    border-radius: 5px;
    border: 2px solid ${(p) => p.theme.input.borderCol};
    /* border-radius: 5px; */
    transition: 340ms;
    :focus {
      opacity: 80%;
      outline: 0;
      transition: 340ms;
    }
  }
`;
