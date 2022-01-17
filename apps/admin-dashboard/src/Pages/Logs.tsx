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
import { LabmakerSocket } from '../utils/APIHandler';
import { useEffect } from 'react';
import { LogDto } from '@labmaker/wrapper';

export function Logs() {
  const { logs, handleLogsChange, parsedConfigs, addLog } = useFetchLogs();
  const { loading, config, handleChange } = useRedditLogic();

  useEffect(() => {
    LabmakerSocket?.on('newLog', (data: any) => {
      const newLog: LogDto = JSON.parse(data);
      console.log(config.id);
      if (newLog.nodeId !== config.id) return;
      if (logs.includes(newLog)) return;
      addLog(newLog);

      // console.log(data);
      // console.log(LabmakerSocket?.id);
    });

    return () => {
      LabmakerSocket?.off('newLog');
      // LabmakerSocket?.on('newLog', (data: any) => {
      //   console.log('Received New Log but Page is not Open');
      // });
    };
  });

  const handleMergeChange = (id: number | string) => {
    if (typeof id === 'string') return;
    handleChange(id);
    handleLogsChange(id);
  };

  return (
    <Page>
      <LoadingSpinner loading={loading} message={'Loading Logs'} />
      {!loading && logs && (
        <Content>
          <ControlsContainer>
            <DropDown
              items={parsedConfigs}
              onChange={handleMergeChange}
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
