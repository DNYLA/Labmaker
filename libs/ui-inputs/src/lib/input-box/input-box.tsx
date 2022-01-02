import { createRef, useRef } from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface InputBoxProps {
  message: string;
  value: string | string[];
  infoEnabled?: boolean;
  infoMessage?: string;
  onChange: Function;
}

interface InfoTitleProps {
  enabled: boolean;
  title: string;
  infoMessage?: string;
}

function InfoTitle({ title, enabled, infoMessage }: InfoTitleProps) {
  const titleRef = createRef<HTMLSpanElement>();
  const boxRef = createRef<HTMLDivElement>();
  if (enabled) {
    return (
      <InfoTitleStyle>
        <StyledSpan>
          {title}
          <InfoSpan ref={titleRef} onMouseEnter={() => {}}>
            ? <InfoBox ref={boxRef}>{infoMessage}</InfoBox>
          </InfoSpan>
        </StyledSpan>
      </InfoTitleStyle>
    );
  } else {
    return <StyledSpan>{title}</StyledSpan>;
  }
}

const StyledInputBox = styled.div``;

export function InputBox({
  message,
  infoMessage,
  infoEnabled,
  value,
  onChange,
}: InputBoxProps) {
  return (
    <StyledInputBox>
      <InfoTitle
        title={message}
        infoMessage={infoMessage}
        enabled={infoEnabled ? true : false}
      />
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

const InfoTitleStyle = styled.div`
  /* z-index: 100; */
`;

const InfoBox = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  opacity: 0;
  position: absolute;
  font-size: 15px;
  /* background-color: '#141617'; */
  background-color: #1f1f1f;
  align-items: center;
  /* top: 5px; */
  /* margin-top: 10px; */
  /* justify-content: center; */
  margin-top: -50px;
  margin-left: 25px;

  :hover {
    cursor: default;
  }
`;

const InfoSpan = styled.span`
  padding: 2px;
  top: 25px;
  text-align: center;
  width: 20px;
  height: 20px;
  font-size: 13px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  display: inline-block;
  :hover div {
    /* opacity: 100%; */
    opacity: 100;
    width: 100px;
    height: 100px;
  }
  :hover {
    cursor: pointer;
  }
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
