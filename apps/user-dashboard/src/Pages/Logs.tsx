import { RootState } from '../store';
import { Labmaker } from '../utils/APIHandler';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogs } from '../utils/slices/logsSlice';
import styled from 'styled-components';
import {
  LogTable,
  DropDown,
  Item,
  LoadingSpinner,
  Content,
  Page,
} from '@labmaker/ui';
import { RedditConfigDto } from '@labmaker/wrapper';
import { useFetchLogs } from '../utils/hooks/useFetchLogs';
import { parseConfigs } from '../utils/helpers';

export function Logs() {
  const { logs, loading, parsedConfigs, handleChange } = useFetchLogs();

  return (
    <Page>
      {logs && (
        <Content>
          <LoadingSpinner loading={loading} message={'Loading Logs'} />

          <ControlsContainer>
            <DropDown items={parsedConfigs} onChange={handleChange} />
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
