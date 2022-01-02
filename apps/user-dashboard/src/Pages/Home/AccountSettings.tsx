import { InputBox } from '@labmaker/ui-inputs';
import { ContainerStyle } from 'apps/user-dashboard/src/assets/styles';
import React from 'react';
import styled from 'styled-components';
interface AccountSettingsProps {}

export function AccountSettings({}: AccountSettingsProps) {
  return (
    <GeneralSettingContainer>
      <h1>Account</h1>
      <InputBox
        message="Client ID"
        value={'My Id'}
        infoEnabled={true}
        infoMessage={
          'Enter Your Client ID for your script from https://reddit.com/prefs/apps'
        }
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="Client Secret"
        value={'My Secret'}
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="Username"
        value={'Username'}
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="Password"
        value={'asdasda3q'}
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="User Agent"
        value={'<platform: firefox>'}
        onChange={(e: any) => console.log(e)}
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
