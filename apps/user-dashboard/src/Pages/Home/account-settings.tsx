import { InputBox } from '@labmaker/ui-inputs';
import { SettingsContainer } from '../../assets/styles';
import React from 'react';
import { RedditConfig } from '../../utils/types';

interface AccountSettingsProps {
  config: RedditConfig;
  setConfig: React.Dispatch<React.SetStateAction<RedditConfig>>;
}

export function AccountSettings({ config, setConfig }: AccountSettingsProps) {
  return (
    <SettingsContainer>
      <h1>Account</h1>
      <InputBox
        message="Client ID"
        value={config.clientId}
        infoMessage={
          'Enter Your Client ID for your script from https://reddit.com/prefs/apps'
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, clientId: e.target.value })
        }
      />
      <InputBox
        message="Client Secret"
        value={config.clientSecret}
        infoMessage={
          'Enter Your Client Secret for your script from https://reddit.com/prefs/apps'
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
