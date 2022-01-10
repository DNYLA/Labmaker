import { useState } from 'react';
import styled from 'styled-components';

interface HoverProps {
  handleMouseOver: () => void;
  handleMouseOut: () => void;
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
