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

const InfoTitleStyle = styled.div``;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  padding: 8px;
  margin-left: 75px;
  margin-top: 10px;
  width: 350px;
  min-height: 50px;
  background-color: ${(p) => p.theme.input.backCol};
  border-radius: 5px;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const InfoSpan = styled.span`
  display: inline-block;
  margin-left: 5px;
  padding: 2px;
  text-align: center;
  width: 20px;
  height: 20px;
  font-size: 13px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;

  :hover {
    cursor: pointer;
  }
`;
