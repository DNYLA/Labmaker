import { AccountSettings } from './account-settings';
import { MainSettings } from './main-settings';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ComboContainer,
  DropDown,
  Item,
  UserControls,
  Page,
  Content,
} from '@labmaker/ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { redditTemplate } from '../../utils/LoadingTypes';
import { addConfigs, setConfig, setUser } from '../../utils/slices/userSlice';
import { Labmaker } from '../../utils/APIHandler';

function useRedditLogic() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);
  const [selectedConfig, setSelectedConfig] = useState(user.nodes[0]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (user.nodes.length === 0) {
      const templateConf = redditTemplate;
      setSelectedConfig(templateConf);
      return;
    }

    setLoading(false);
  }, [user.nodes.length]);

  const saveNode = async () => {
    const oldConfig = user.nodes.find((c) => c.id === selectedConfig.id);
    if (oldConfig === selectedConfig) return;
    if (!selectedConfig.newNode) {
      const updatedConf = await Labmaker.Reddit.update(selectedConfig);
      if (!updatedConf) return;
      dispatch(setConfig(updatedConf));
    } else {
      const newNode = await Labmaker.Reddit.create({
        ...selectedConfig,
        userId: user.id,
      });

      if (newNode) {
        dispatch(addConfigs([newNode]));
      }
    }

    return;
  };

  const deleteNode = async () => {
    await Labmaker.Reddit.deleteConfig(selectedConfig.id);
    const nodes = [...user.nodes];
    const index = nodes.indexOf(selectedConfig);

    if (index > -1) {
      nodes.splice(index, 1);
      dispatch(setUser({ ...user, nodes }));
    }
    setSelectedConfig(user.nodes[0]);
  };

  const createNode = () => {
    const templateNode = redditTemplate;
    setSelectedConfig(templateNode);
  };

  return {
    selectedConfig,
    setSelectedConfig,
    saveNode,
    deleteNode,
    createNode,
    user,
    isLoading,
  };
}

export function Home() {
  const {
    selectedConfig,
    setSelectedConfig,
    createNode,
    saveNode,
    deleteNode,
    user,
    isLoading,
  } = useRedditLogic();

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

  if (isLoading) {
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
