import { InputBox } from '@labmaker/ui-inputs';
import { ContainerStyle } from 'apps/user-dashboard/src/assets/styles';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SwitchToggle } from '@labmaker/ui-inputs';
/* eslint-disable-next-line */
export interface MainSettingsProps {}

const StyledMainSettings = styled.div`
  color: pink;
`;

export function MainSettings(props: MainSettingsProps) {
  const [isLogging, setIsLogging] = useState(false);

  return (
    <GeneralSettingContainer>
      <h1>Main</h1>
      <InputBox
        message="Title"
        value={'My Title'}
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="Body"
        value={'My Message'}
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="Subreddits"
        value={'Convert Into New Component'}
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="Blocked Words"
        value={'Convert Into New Component'}
        onChange={(e: any) => console.log(e)}
      />
      <InputBox
        message="Node Editors"
        value={'Convert Into New Component'}
        onChange={(e: any) => console.log(e)}
      />
      <SwitchToggle
        message="Log Activity"
        toggled={isLogging}
        onToggle={() => setIsLogging(!isLogging)}
        infoMessage="Activity is currently logged regardless of this value"
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
