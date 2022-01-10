import { InputBox, TagInputBox } from '@labmaker/ui-inputs';
import { SettingsContainer } from '../../assets/styles';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SwitchToggle } from '@labmaker/ui-inputs';
import { RedditConfig } from '../../utils/types';

/* eslint-disable-next-line */
export interface MainSettingsProps {
  config: RedditConfig;
  setConfig: React.Dispatch<React.SetStateAction<RedditConfig>>;
}

export function MainSettings({ config, setConfig }: MainSettingsProps) {
  const [isLogging, setIsLogging] = useState(true);

  return (
    <SettingsContainer>
      <h1>Main</h1>
      <InputBox
        message="Title"
        value={config.title}
        onChange={(e) => setConfig({ ...config, title: e.target.value })}
      />
      <InputBox
        message="Body"
        value={config.pmBody}
        onChange={(e) => setConfig({ ...config, pmBody: e.target.value })}
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
          title={'Words'}
          items={config.forbiddenWords}
          onChange={(updatedValues: string[]) =>
            setConfig({ ...config, forbiddenWords: updatedValues })
          }
        />
        <span>-</span>
        <TagInputBox
          title={'Users'}
          items={config.blockedUsers}
          onChange={(updatedValues: string[]) =>
            setConfig({ ...config, blockedUsers: updatedValues })
          }
        />
        <span>-</span>
        <TagInputBox
          title={'Editors'}
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
    </SettingsContainer>
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