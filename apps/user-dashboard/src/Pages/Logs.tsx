import { RootState } from '../store';
import { Labmaker } from '../utils/APIHandler';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogs } from '../utils/slices/logsSlice';
import styled from 'styled-components';
import { DropDown, Item, UserControls } from '@labmaker/ui-inputs';
import { LogTable } from '@labmaker/ui-header';

const StyledLogs = styled.div`
  margin: 0 250px;
`;

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

  const parseConfigs = () => {
    const parsedData = new Array<Item>();
    const allConfigs = [...user.nodes];
    for (let i = 0; i < allConfigs.length; i++) {
      const config = allConfigs[i];
      parsedData.push({
        value: config.id,
        label: config.username,
        selected: true,
      });
    }

    if (parsedData.length > 0) {
      parsedData[0].selected = true;
      setParsedConfigs(parsedData);
    }
  };

  useEffect(() => {
    const loadLogs = async () => {
      parseConfigs();

      if (user.nodes.length > 0) {
        const data = await Labmaker.Log.getLogs(user.nodes[0].id);
        dispatch(setLogs(data));
      }

      setLoading(false);
    };
    loadLogs();
  }, []);

  const onChange = async (id: number) => {
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

  if (!isLoading) {
    return (
      <StyledLogs>
        <ControlsContainer>
          <DropDown items={parsedConfigs} onChange={onChange} />
        </ControlsContainer>
        <SettingsContainer>
          <h1>Logs</h1>
          <LogTable logs={logs} />
        </SettingsContainer>
      </StyledLogs>
    );
  } else {
    return <div>Loading</div>;
  }
}

const ControlsContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 25px;
`;

const SettingsContainer = styled.div`
  margin-top: 90px;
  display: flex;
  flex-direction: column;
  padding-left: 25px;

  h1 {
    text-align: center;
    border-radius: 5px;
    width: 100%;
  }
`;
