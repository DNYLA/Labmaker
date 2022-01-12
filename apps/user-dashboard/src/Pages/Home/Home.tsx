import { AccountSettings } from './account-settings';
import { MainSettings } from './main-settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSave,
  faTrashAlt,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ComboContainer,
  DropDown,
  IOnDropDownChange,
  Item,
  UserControls,
} from '@labmaker/ui-inputs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { redditTemplate } from '../../utils/LoadingTypes';
import { addConfigs, setConfig, setUser } from '../../utils/slices/userSlice';
import { Labmaker, LabmakerSocket } from '../../utils/APIHandler';
import { RedditConfigDto } from '@labmaker/wrapper';
import { toast } from 'react-toastify';

// interface HomeProps {}

const StyledHome = styled.div`
  margin: 0 250px;
`;

function useRedditLogic() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);
  const [selectedConfig, setSelectedConfig] = useState(user.nodes[0]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (user.nodes.length === 0) {
      const templateConf = redditTemplate;
      setSelectedConfig(templateConf);
    }

    setLoading(false);
  }, [user.nodes.length]);

  useEffect(() => {
    LabmakerSocket?.on('config', (data) => {
      const configObj: RedditConfigDto = JSON.parse(data);
      const oldConfig = user.nodes.find((c) => c.id === configObj.id);
      if (oldConfig === configObj) return; //This means the user Invoked the update request

      if (!selectedConfig || selectedConfig.id === configObj.id) {
        setSelectedConfig(configObj);
      }
      if (oldConfig) {
        dispatch(setConfig(configObj));
      } else {
        dispatch(addConfigs([configObj]));
      }

      // console.log(data);
      // console.log(LabmakerSocket?.id);
    });
  }, [LabmakerSocket]);

  const saveNode = async () => {
    const oldConfig = user.nodes.find((c) => c.id === selectedConfig.id);
    if (oldConfig === selectedConfig) {
      toast.info('Edit the config before saving');
      return;
    }
    if (!selectedConfig.newNode) {
      const updatedConf = await Labmaker.Reddit.update(selectedConfig);
      if (!updatedConf) return;
      dispatch(setConfig(updatedConf));
      setSelectedConfig(updatedConf);
      toast.success(`Saved ${selectedConfig.username}`, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      await Labmaker.Reddit.create({
        ...selectedConfig,
        userId: user.id,
      }); //Once created the created object (with the id) will be sent through the socket
      toast.success(`Created ${selectedConfig.username}`, {
        position: 'top-right',
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

    toast.success(`Deleted ${selectedConfig.username}`);
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
    <StyledHome>
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
    </StyledHome>
  );
}

const ControlsContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 25px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
