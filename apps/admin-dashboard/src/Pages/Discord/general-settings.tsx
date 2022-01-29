import styled from 'styled-components';
import {
  DropDown,
  InputBox,
  SettingsContainer,
  SwitchToggle,
} from '@labmaker/ui';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';

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
  return (
    <SettingsContainer id="GeneralSettings">
      <h1>General</h1>

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

          <SwitchToggle
            message="Enable Tickets"
            toggled={config.autoTicket}
            onToggle={() => {
              setConfig({
                ...config,
                autoTicket: !config.autoTicket,
              });
            }}
          />

          <SwitchToggle
            message="Auto Reacter"
            toggled={config.autoReact}
            onToggle={() => {
              setConfig({
                ...config,
                autoReact: !config.autoReact,
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
