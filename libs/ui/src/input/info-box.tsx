import styled from 'styled-components';

interface InfoTitleProps {
  title: string;
  infoMessage?: string | React.ReactNode;
  header?: boolean;
  center?: boolean;
}

export function InfoTitle({
  title,
  infoMessage,
  header,
  center,
}: InfoTitleProps) {
  const headerClass = header ? 'headerTitle' : '';
  const centerClass = center ? 'centerTitle' : '';

  if (infoMessage) {
    return (
      <StyledSpan className={centerClass}>
        <TitleStyle className={headerClass}>{title}</TitleStyle>
        <InfoSpan>?</InfoSpan>
        <InfoBoxWrapper>
          <InfoBox>{infoMessage}</InfoBox>
        </InfoBoxWrapper>
      </StyledSpan>
    );
  } else {
    return (
      <StyledSpan className={`${headerClass} ${centerClass}`}>
        {title}
      </StyledSpan>
    );
  }
}

const StyledSpan = styled.span`
  user-select: none;
  display: flex;
  align-items: center;
  padding-right: 5px;
  margin-left: 2px;
  color: ${(p) => p.theme.input.text};

  &.centerTitle {
    justify-content: center;
    align-items: center;
  }

  &.headerTitle {
    font-size: 24px;
  }
`;

const TitleStyle = styled.span`
  user-select: none;
`;

const InfoBox = styled.div`
  width: 350px;
  min-height: 50px;
  background-color: ${(p) => p.theme.input.backCol};
  border-radius: 5px;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const InfoBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  padding-top: 25px;
  margin-left: 35px;
  z-index: 1;
  visibility: hidden;
  opacity: 0;
  transition: opacity 200ms ease-in;

  &:hover {
    visibility: visible;
    opacity: 1;
  }
`;

const InfoSpan = styled.span`
  display: inline-block;
  margin-left: 8px;
  /* padding: 2px; */
  text-align: center;
  width: 20px;
  height: 20px;
  font-size: 13px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  cursor: help;

  &:hover {
    & + ${InfoBoxWrapper} {
      visibility: visible;
      opacity: 1;
    }
  }
`;
