import { AccountSettings } from './account-settings';
import { MainSettings } from './main-settings';
import styled from 'styled-components';
import {
  ComboContainer,
  Content,
  DropDown,
  Page,
  UserControls,
} from '@labmaker/ui';
import { useRedditLogic } from '../../utils/hooks/useRedditLogic';

export function Home() {
  const {
    config,
    setConfig,
    parsedConfigs,
    loading,
    handleCreate,
    handleSave,
    handleDelete,
    handleRefresh,
    handleChange,
  } = useRedditLogic();

  return (
    <Page>
      {!loading && (
        <Content>
          <ControlsContainer>
            <DropDown
              items={parsedConfigs}
              onChange={handleChange}
              value={config.id}
            />
            <UserControls
              onDelete={handleDelete}
              onRefresh={handleRefresh}
              onCreate={handleCreate}
              onSave={handleSave}
            />
          </ControlsContainer>

          <ComboContainer>
            <AccountSettings config={config} setConfig={setConfig} />
            <MainSettings config={config} setConfig={setConfig} />
          </ComboContainer>
        </Content>
      )}
    </Page>
  );
}

const ControlsContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;

  @media (max-width: 800px) {
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    & > div:not(:last-child) {
      margin-bottom: 15px;
    }
  }
`;
