import { InputBox } from '@labmaker/ui';
import { SettingsContainer } from '../../assets/styles';
import React from 'react';
import { RedditConfig } from '../../utils/types';

interface AccountSettingsProps {
  config: RedditConfig;
  setConfig: React.Dispatch<React.SetStateAction<RedditConfig>>;
}

export function AccountSettings({ config, setConfig }: AccountSettingsProps) {
  const redditAppsURL = (
    <a href="https://reddit.com/prefs/apps" target="_blank" rel="noreferrer">
      https://reddit.com/prefs/apps
    </a>
  );

  return (
    <SettingsContainer>
      <h1>Account</h1>

      <InputBox
        message="Client ID"
        value={config.clientId}
        infoMessage={
          <span>Enter Your Client ID for your script from {redditAppsURL}</span>
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, clientId: e.target.value })
        }
      />

      <InputBox
        message="Client Secret"
        value={config.clientSecret}
        infoMessage={
          <span>
            Enter Your Client Secret for your script from {redditAppsURL}
          </span>
        }
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
