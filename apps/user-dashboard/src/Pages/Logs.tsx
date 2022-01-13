import { RootState } from '../store';
import { Labmaker } from '../utils/APIHandler';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogs } from '../utils/slices/logsSlice';
import styled from 'styled-components';
import { LogTable, DropDown, Item, LoadingSpinner } from '@labmaker/ui';
import { RedditConfigDto } from '@labmaker/wrapper';

const StyledLogs = styled.div`
  margin: 0 250px;
  transition: all 5s ease-in-out;

  table {
    width: 100%;
    text-align: center;
  }
`;

function parseConfigs(configs: RedditConfigDto[]) {
  const parsedData = new Array<Item>();
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    parsedData.push({
      value: config.id,
      label: config.username,
      selected: true,
    });
  }

  if (parsedData.length > 0) {
    parsedData[0].selected = true;
  }

  return parsedData;
}

export function Logs() {
  const itemLoad: Item = {
    value: 0,
    label: '',
    selected: true,
  };

  const [isLoading, setLoading] = useState(true);
  const [parsedConfigs, setParsedConfigs] = useState([itemLoad]);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);
  const logs = useSelector((state: RootState) => state.logs.value);

  useEffect(() => {
    const loadLogs = async () => {
      setParsedConfigs(parseConfigs(user.nodes));

      if (user.nodes.length > 0) {
        const data = await Labmaker.Log.getLogs(user.nodes[0].id);
        dispatch(setLogs(data));
      }

      //If Logs are empty the loading bar flashes for less than a milisecond which looks like a weird bug.
      setTimeout(() => {
        setLoading(false);
      }, 150);
    };
    loadLogs();
  }, [dispatch, user.nodes]);

  const onChange = async (id: number | string) => {
    const items = [...parsedConfigs];
    const foundItem = items.find((item) => item.value === id);
    if (!foundItem) return;

    const config = user.nodes.find((c) => c.id === foundItem.value);
    if (!config) return;

    setLoading(true);
    const data = await Labmaker.Log.getLogs(config.id);

    dispatch(setLogs(data));
    setLoading(false);
  };

  return (
    <StyledLogs>
      <LoadingSpinner loading={isLoading} message={'Loading Logs'} />
      <ControlsContainer>
        <DropDown items={parsedConfigs} onChange={onChange} />
      </ControlsContainer>
      <SettingsContainer>
        <h1>Logs</h1>
        <LogTable logs={logs} title={'Logs'} />
      </SettingsContainer>
    </StyledLogs>
  );
}

const ControlsContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 25px;
`;

const SettingsContainer = styled.div`
  padding-left: 25px;

  h1 {
    text-align: center;
  }
`;
