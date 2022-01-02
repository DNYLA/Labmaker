import styled from 'styled-components';

/* eslint-disable-next-line */
export interface InputBoxProps {
  message: String;
  value: string | string[];
  onChange: Function;
}

const StyledInputBox = styled.div``;

export function InputBox({ message, value, onChange }: InputBoxProps) {
  return (
    <StyledInputBox>
      <StyledSpan>{message}</StyledSpan>
      <InputContainer>
        <input value={value} onChange={(e) => onChange(e)} />
      </InputContainer>
    </StyledInputBox>
  );
}

export default InputBox;

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
  color: ${(p) => p.theme.input.text};
`;

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
      /* background: #1f1f1f; */
      opacity: 80%;
      /* border: 2px solid #292929; */
      outline: 0;
      transition: 340ms;
    }
  }
`;
