import { InfoTitle, InputBox, SettingsContainer } from '@labmaker/ui';
import React from 'react';
import { RedditConfig } from '../../utils/types';
import { RedditConfigDto } from '@labmaker/wrapper';
import styled from 'styled-components';

interface AccountSettingsProps {
  config: RedditConfigDto;
  setConfig: React.Dispatch<React.SetStateAction<RedditConfigDto>>;
}

export function AccountSettings({ config, setConfig }: AccountSettingsProps) {
  const redditAppsURL = (
    <a href="https://reddit.com/prefs/apps" target="_blank" rel="noreferrer">
      https://reddit.com/prefs/apps
    </a>
  );

  return (
    <SettingsContainer>
      <InfoTitle
        title={'Account'}
        infoMessage={
          <span>Enter the details your script from {redditAppsURL}</span>
        }
        header={true}
      />
      <InputBox
        message="Client ID"
        value={config.clientId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, clientId: e.target.value })
        }
      />

      <InputBox
        message="Client Secret"
        value={config.clientSecret}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, clientSecret: e.target.value })
        }
      />

      <InputBox
        message="Username"
        value={config.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, username: e.target.value })
        }
      />

      <InputBox
        message="Password"
        value={config.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, password: e.target.value })
        }
      />

      <InputBox
        message="User Agent"
        value={config.userAgent}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, userAgent: e.target.value })
        }
      />
    </SettingsContainer>
  );
}
