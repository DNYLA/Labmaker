import { InputBox } from '../../components/Inputs/InputBox';
import { Switch } from '../../components/Inputs/Switch';
import { TagInputBox } from '../../components/Inputs/TagInput';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ContainerStyle } from '../../styles/Styles';
import { updateReddit } from '../../utils/slices/configSlices';
import { Node } from '../../utils/types';

type SettingsProps = {
  config: Node;
};

export const MainSettings = ({ config }: SettingsProps) => {
  const [isLogging, setIsLogging] = useState(false);
  const dispatch = useDispatch();

  return (
    <GeneralSettingContainer id="comboContainer">
      <h1>Main</h1>
      <InputBox
        message="Title"
        value={config.title}
        onChange={(e: any) => {
          dispatch(
            updateReddit({
              ...config,
              title: e.target.value,
            })
          );
        }}
      />
      <InputBox
        message="Body"
        value={config.pmBody}
        onChange={(e: any) => {
          dispatch(
            updateReddit({
              ...config,
              pmBody: e.target.value,
            })
          );
        }}
      />
      <TagBoxMiniContainer>
        <TagInputBox
          message="Subreddits"
          items={config.subreddits}
          onChange={(updatedValues: any) => {
            dispatch(
              updateReddit({
                ...config,
                subreddits: updatedValues,
              })
            );
          }}
        />

        <TagInputBox
          message="Forbidden Words"
          items={config.forbiddenWords}
          onChange={(updatedValues: any) => {
            dispatch(
              updateReddit({
                ...config,
                forbiddenWords: updatedValues,
              })
            );
          }}
        />

        <TagInputBox
          message="Blocked Users"
          items={config.blockedUsers}
          onChange={(updatedValues: any) => {
            dispatch(
              updateReddit({
                ...config,
                blockedUsers: updatedValues,
              })
            );
          }}
        />
        <TagInputBox
          message="Node Editors"
          items={config.nodeEditors}
          onChange={(updatedValues: any) => {
            dispatch(
              updateReddit({
                ...config,
                nodeEditors: updatedValues,
              })
            );
          }}
        />
      </TagBoxMiniContainer>

      <Switch
        message="Log Bot Activity"
        toggled={isLogging}
        onToggle={() => setIsLogging(!isLogging)}
      />
    </GeneralSettingContainer>
  );
};

const GeneralSettingContainer = styled(ContainerStyle)`
  display: flex;
  flex-direction: column;
  padding: 25px;

  h1 {
    text-align: center;
    border-radius: 5px;
    width: 100%;
  }

  .inputBox {
    width: 100%;
    padding-bottom: 10px;
  }
  @media (max-width: 812px) {
    display: block;
  }
`;

const TagBoxMiniContainer = styled.div`
  * {
    /* transition: all 0.35s; */
    transition: all 350ms ease-out;
  }
`;
