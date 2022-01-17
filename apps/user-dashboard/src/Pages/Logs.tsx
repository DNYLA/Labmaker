import styled from 'styled-components';
import {
  LogTable,
  DropDown,
  LoadingSpinner,
  Content,
  Page,
} from '@labmaker/ui';
import { useFetchLogs } from '../utils/hooks/useFetchLogs';
import { useRedditLogic } from '../utils/hooks/useRedditLogic';

export function Logs() {
  const { logs, loading, parsedConfigs, handleChange } = useFetchLogs();
  const { config } = useRedditLogic();
  return (
    <Page>
      <LoadingSpinner loading={loading} message={'Loading Logs'} />
      {logs && (
        <Content>
          <ControlsContainer>
            <DropDown
              items={parsedConfigs}
              onChange={handleChange}
              value={config.id}
            />
          </ControlsContainer>
          <SettingsContainer>
            <h1>Logs</h1>
            <LogTable logs={logs} title={'Logs'} />
          </SettingsContainer>
        </Content>
      )}
    </Page>
  );
}

const ControlsContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
`;

const SettingsContainer = styled.div`
  h1 {
    text-align: center;
    margin: 20px 0;
  }
`;
