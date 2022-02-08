import styled from 'styled-components';
import {
  DropDown,
  InfoTitle,
  InputBox,
  SettingsContainer,
  SwitchToggle,
  ModalPopup,
} from '@labmaker/ui';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';
import { useNavigate } from 'react-router-dom';
import { TutorApplications } from './tutor-applications';
import { useState } from 'react';

/* eslint-disable-next-line */
export interface GeneralSettingsProps {
  // config: configDto;
  // setConfig: React.Dispatch<React.SetStateAction<configDto>>;
  // parsedGuilds: Item[];
  // changeEvent: IOnDropDownChange;
}

export function GeneralSettings(props: GeneralSettingsProps) {
  const { config, parsedGuilds, onConfigIdChanged, setConfig } =
    useGuildLogic();

  const navigate = useNavigate();

  const [tutorAppsOpen, setTutorAppsOpen] = useState(false);

  const handleTutorApps = () => {
    // navigate('applications');
  };

  return (
    <SettingsContainer id="GeneralSettings">
      <InfoTitle title={'General'} header={true} />

      <StyledSpan>Payment Config</StyledSpan>
      {config.id !== '-1' && (
        <div>
          <DropDown
            items={parsedGuilds}
            onChange={onConfigIdChanged}
            value={config.paymentConfigId}
          />

          <InputBox
            message="Prefix"
            value={config.prefix}
            onChange={(e) => {
              setConfig({
                ...config,
                prefix: e.target.value,
              });
            }}
          />

          <InputBox
            message="Bot Image URL"
            value={config.embedImageUrl}
            onChange={(e) => {
              setConfig({
                ...config,
                embedImageUrl: e.target.value,
              });
            }}
          />

          {/* 
          <SwitchToggle
            message="Advanced User Switcher"
            toggled={config.autoSwitcher}
            onToggle={() => {
              setConfig({
                ...config,
                autoSwitcher: !config.autoSwitcher,
              });
            }}
          /> */}

          {/* <TutorApplications
            design={<span>Tutor Applications</span>}
            open={tutorAppsOpen}
            setOpen={setTutorAppsOpen}
          /> */}

          <SwitchToggle
            message="Enable Tickets"
            toggled={config.ticketSystem}
            onToggle={() => {
              setConfig({
                ...config,
                ticketSystem: !config.ticketSystem,
              });
            }}
          />
        </div>
      )}
    </SettingsContainer>
  );
}

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
  margin-bottom: 5px;
`;

const StyledLink = styled.span`
  cursor: pointer;
  color: ${(p) => p.theme.navbar.item};

  :hover {
    color: ${(p) => p.theme.input.switchActive};
  }
`;
