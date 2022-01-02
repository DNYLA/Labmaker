import styled from 'styled-components';

/* eslint-disable-next-line */
export interface GeneralSettingsProps {}

const StyledGeneralSettings = styled.div`
  color: pink;
`;

export function GeneralSettings(props: GeneralSettingsProps) {
  return (
    <StyledGeneralSettings>
      <h1>Welcome to GeneralSettings!</h1>
    </StyledGeneralSettings>
  );
}

export default GeneralSettings;
