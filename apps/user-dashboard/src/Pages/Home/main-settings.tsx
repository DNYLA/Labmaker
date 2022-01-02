import { InputBox, TagInputBox } from '@labmaker/ui-inputs';
import { ContainerStyle } from '../../assets/styles';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SwitchToggle } from '@labmaker/ui-inputs';
import { RedditConfig } from 'apps/user-dashboard/src/utils/types';
/* eslint-disable-next-line */
export interface MainSettingsProps {
  config: RedditConfig;
  setConfig: Function;
}

export function MainSettings({ config, setConfig }: MainSettingsProps) {
  const [isLogging, setIsLogging] = useState(true);

  return (
    <GeneralSettingContainer>
      <h1>Main</h1>
      <InputBox
        message="Title"
        value={config.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, title: e.target.value })
        }
      />
      <InputBox
        message="Body"
        value={config.pmBody}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfig({ ...config, pmBody: e.target.value })
        }
      />
      <TagContainer>
        <TagInputBox
          title={'Subreddits'}
          items={config.subreddits}
          onChange={(updatedValues: string[]) =>
            setConfig({ ...config, subreddits: updatedValues })
          }
        />
        <span>-</span>
        <TagInputBox
          title={'Blocked Users'}
          items={config.blockedUsers}
          onChange={(updatedValues: string[]) =>
            setConfig({ ...config, blockedUsers: updatedValues })
          }
        />
        <span>-</span>
        <TagInputBox
          title={'Node Editors'}
          items={config.nodeEditors}
          onChange={(updatedValues: string[]) =>
            setConfig({ ...config, nodeEditors: updatedValues })
          }
        />
      </TagContainer>
      <SwitchToggle
        message="Log Activity"
        toggled={isLogging}
        onToggle={() => setIsLogging(!isLogging)}
        infoMessage="Activity is currently logged regardless of this value"
      />
    </GeneralSettingContainer>
  );
}

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    margin-right: 10px;
    list-style-type: disc;
  }
  span {
    margin: 0px 5px;
    padding-bottom: 15px;
  }
`;

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
