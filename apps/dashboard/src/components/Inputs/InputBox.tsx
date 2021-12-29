import styled from 'styled-components';

type InputProps = {
  message: String;
  value: string | string[];
  onChange: Function;
};

export const InputBox = ({ message, value, onChange }: InputProps) => {
  return (
    <div className="inputBox">
      <StyledSpan>{message}</StyledSpan>
      <InputContainer>
        <input value={value} onChange={(e) => onChange(e)} />
      </InputContainer>
    </div>
  );
};

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
`;

const InputContainer = styled.div`
  display: flex;
  height: 23px;
  padding-bottom: 10px;
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
    background: #141617;
    border: 2px solid #1f1f1f;
    border-radius: 5px;
    transition: 340ms;
    :focus {
      background: #1f1f1f;
      border: 2px solid #292929;
      outline: 0;
      transition: 340ms;
    }
  }
`;
