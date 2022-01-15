import { AccountSettings } from './account-settings';
import { MainSettings } from './main-settings';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ComboContainer,
  DropDown,
  Item,
  UserControls,
} from '@labmaker/ui-inputs';
import { useFetchReddit } from '../../utils/hooks/useFetchReddit';

const StyledHome = styled.div`
  margin: 0 250px;
`;

export function Home() {
  const {
    selectedConfig,
    setSelectedConfig,
    createNode,
    saveNode,
    deleteNode,
    user,
    loading,
  } = useFetchReddit();

  const itemLoad: Item = {
    value: 0,
    label: '',
    selected: true,
  };

  const [selected, setSelected] = useState(itemLoad);
  const [parsedItems, setParsedItems] = useState([itemLoad]);

  useEffect(() => {
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
        setSelected(parsedData[0]);
        setParsedItems(parsedData);
      }
    };
    parseConfigs();
  }, [user.nodes]);

  const refreshItem = () => {
    const config = user.nodes.find((c) => c.id === selected.value);
    if (!config) return;
    setSelectedConfig(config);
  };

  const onChange = (id: number | string) => {
    if (typeof id === 'string') return; //This will never happen however typescript requires i check

    const items = [...parsedItems];
    const foundItem = items.find((item) => item.value === id);
    if (!foundItem) return;

    const config = user.nodes.find((c) => c.id === foundItem.value);
    setSelected(foundItem);
    if (!config) return;
    setSelectedConfig(config);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Page>
      <Content>
        <ControlsContainer>
          <DropDown items={parsedItems} onChange={onChange} />

          <UserControls
            onDelete={deleteNode}
            onRefresh={refreshItem}
            onCreate={createNode}
            onSave={saveNode}
          />
        </ControlsContainer>

        <ComboContainer>
          <AccountSettings
            config={selectedConfig}
            setConfig={setSelectedConfig}
          />

          <MainSettings config={selectedConfig} setConfig={setSelectedConfig} />
        </ComboContainer>
      </Content>
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
