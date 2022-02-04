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

        <InfoWrapper>
          <InfoSpan className={headerClass}>?</InfoSpan>

          <InfoBoxWrapper>
            <InfoBox>{infoMessage}</InfoBox>
          </InfoBoxWrapper>
        </InfoWrapper>
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

  .centerTitle {
    justify-content: center;
    align-items: center;
  }

  .headerTitle {
    font-size: 25px;
    margin-bottom: 30px;
  }
`;

const TitleStyle = styled.span`
  user-select: none;
`;

const InfoWrapper = styled.div`
  position: relative;
`;

const InfoBox = styled.div`
  width: 100%;
  min-height: 50px;
  padding: 15px;
  background-color: ${(p) => p.theme.input.backCol};
  border-radius: 5px;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const InfoBoxWrapper = styled.div`
  position: absolute;
  min-width: 200px;
  max-width: 350px;
  top: 0;
  padding-top: 25px;
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

  &.headerTitle {
    /* font-size: 20px; */
    width: 35px;
    height: 35px;
  }
`;
