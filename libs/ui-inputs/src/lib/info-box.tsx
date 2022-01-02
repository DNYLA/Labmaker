import { createRef, useRef, useState } from 'react';
import styled from 'styled-components';

interface HoverProps {
  handleMouseOver: any;
  handleMouseOut: any;
}

function HoverBox({ handleMouseOver, handleMouseOut }: HoverProps) {
  return (
    <InfoSpan onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      ?
    </InfoSpan>
  );
}

interface InfoTitleProps {
  enabled: boolean;
  title: string;
  infoMessage?: string;
}

export function InfoTitle({ title, enabled, infoMessage }: InfoTitleProps) {
  const [isHovering, setIsHovering] = useState(false);

  if (enabled) {
    return (
      <InfoTitleStyle>
        <StyledSpan>
          {title}
          <HoverBox
            handleMouseOver={() => setIsHovering(true)}
            handleMouseOut={() => setIsHovering(false)}
          />
          {isHovering && <InfoBox>{infoMessage}</InfoBox>}
        </StyledSpan>
      </InfoTitleStyle>
    );
  } else {
    return <StyledSpan>{title}</StyledSpan>;
  }
}

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
  color: ${(p) => p.theme.input.text};
`;

const InfoTitleStyle = styled.div`
  /* z-index: 100; */
`;

const InfoBox = styled.div`
  padding: 5px 2px;
  margin-left: 75px;
  margin-top: 10px;
  width: 350px;
  height: 50px;
  background-color: black;
  position: absolute;
  text-align: center;
`;

const InfoSpan = styled.span`
  margin-left: 5px;
  padding: 2px;
  top: 25px;
  text-align: center;
  width: 15px;
  height: 15px;
  font-size: 13px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  display: inline-block;
  text-align: center;
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
      opacity: 80%;
      outline: 0;
      transition: 340ms;
    }
  }
`;
