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
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);
  const logs = useSelector((state: RootState) => state.logs.value);

  const itemLoad: Item = {
    id: 0,
    title: '',
    selected: true,
  };

  const [selected, setSelected] = useState(itemLoad);
  const [parsedItems, setParsedItems] = useState([itemLoad]);

  useEffect(() => {
    const loadLogs = async () => {
      if (user.nodes.length > 0) {
        const data = await Labmaker.Log.getLogs(user.nodes[0].id);
        dispatch(setLogs(data));
        setLoading(false);
      }
      const parseConfigs = () => {
        const parsedData = new Array<Item>();
        const allConfigs = [...user.nodes];
        for (let i = 0; i < allConfigs.length; i++) {
          const config = allConfigs[i];
          parsedData.push({
            id: config.id,
            title: config.username,
            selected: true,
          });
        }

        if (parsedData.length > 0) {
          parsedData[0].selected = true;
          setSelected(parsedData[0]);
          setParsedItems(parsedData);
        }
      };

      parseConfigs();
      loadLogs();
    };

    loadLogs();
  }, [dispatch, user.nodes]);

  const onChange = async (id: number) => {
    const items = [...parsedItems];
    const foundItem = items.find((item) => item.id === id);
    if (!foundItem) return;

    const config = user.nodes.find((c) => c.id === foundItem.id);
    setSelected(foundItem);
    if (!config) return;

    setLoading(true);
    const data = await Labmaker.Log.getLogs(config.id);

    dispatch(setLogs(data));
    setLoading(false);
  };

  return (
    <StyledLogs>
      <ControlsContainer>
        <DropDown
          items={parsedItems}
          selected={selected}
          setSelected={setSelected}
          onChange={onChange}
        />
      </ControlsContainer>
      <SettingsContainer>
        <h1>Logs</h1>
        <LogTable logs={logs} />
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
