import { InputBox } from '@labmaker/ui-inputs';
import { ContainerStyle } from '../../assets/styles';
import styled from 'styled-components';
import React from 'react';
import { RedditConfig } from 'apps/user-dashboard/src/utils/types';

interface AccountSettingsProps {
  config: RedditConfig;
  setConfig: Function;
}

export function AccountSettings({ config, setConfig }: AccountSettingsProps) {
  return (
    <GeneralSettingContainer>
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
    </GeneralSettingContainer>
  );
}

const GeneralSettingContainer = styled(ContainerStyle)`
  display: flex;
  flex-direction: column;
  padding: 25px;
  padding-top: 5px;
  h1 {
    text-align: center;
    border-radius: 5px;
    width: 100%;
    font-size: 24px;
  }

  .inputBox {
    width: 100%;
    padding-bottom: 10px;
  }
  @media (max-width: 812px) {
    display: block;
  }
`;
