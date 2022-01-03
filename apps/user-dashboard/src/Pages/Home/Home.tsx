import { ComboContainer } from '../../assets/styles';
import { AccountSettings } from './account-settings';
import { MainSettings } from './main-settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faRemoveFormat,
  faSave,
  faTrash,
  faTrashAlt,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DropDown, Item } from '@labmaker/ui-inputs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'apps/user-dashboard/src/store';
import { RedditConfig } from 'apps/user-dashboard/src/utils/types';
import { redditTemplate } from 'apps/user-dashboard/src/utils/LoadingTypes';
import {
  addRedditConfigs,
  setRedditConfig,
} from 'apps/user-dashboard/src/utils/slices/configSlices';
import { setUser } from 'apps/user-dashboard/src/utils/slices/userSlice';
import { Labmaker } from 'apps/user-dashboard/src/utils/APIHandler';

// interface HomeProps {}

const StyledHome = styled.div`
  margin: 0 250px;
`;

function useRedditLogic() {
  const dispatch = useDispatch();
  const [reload, setReload] = useState(true);
  const user = useSelector((state: RootState) => state.user.value);
  const redditConfigs = useSelector(
    (state: RootState) => state.redditConfig.value
  );
  const [selectedConfig, setSelectedConfig] = useState(redditConfigs[0]);

  const handleClick = async (node: RedditConfig) => {
    if (node.id === selectedConfig.id && node.id !== -1) {
      console.log('ended');
      return;
    }

    if (node.id === -1) {
      console.log('Creating New');
      //Create Node
      const newNode: RedditConfig = { ...redditTemplate, id: -1 };
      dispatch(addRedditConfigs([{ ...newNode, id: -1, userId: user.id }]));
      const config = redditConfigs.find((c) => c.id === -1);
      if (config) setSelectedConfig(config);
    } else {
      const config: RedditConfig = node;

      if (!config) {
        console.log('Invalid Id/Error Occured?');
        return;
      }
      setSelectedConfig(config);
    }
  };

  const loadConfig = async () => {
    if (redditConfigs.length === 0) {
      const templateConf = redditTemplate;
      setSelectedConfig(templateConf);
      return;
    }
  };

  useEffect(() => {
    const asyncLoad = async () => {
      // await loadConfig();
    };

    asyncLoad();
  }, []);

  const saveNode = async () => {
    const oldConfig = redditConfigs.find((c) => c.id === selectedConfig.id);
    if (oldConfig === selectedConfig) return;
    if (!selectedConfig.newNode) {
      Labmaker.Reddit.update(selectedConfig);
      dispatch(setRedditConfig(selectedConfig));
    } else {
      const newNode = await Labmaker.Reddit.create({
        ...selectedConfig,
        userId: user.id,
      });

      if (newNode) {
        dispatch(addRedditConfigs([newNode]));
        dispatch(setUser({ ...user, nodes: [...user.nodes, newNode] }));
        // setReload(true);
      }
    }

    return;
  };

  const deleteNode = async () => {
    // if (redditConfig.id === '3630aeb2-38c5-4c36-a0d5-5c2d95fa35b0') return;

    await Labmaker.Reddit.deleteConfig(selectedConfig.id);
    const nodes = [...user.nodes];
    const index = nodes.indexOf(selectedConfig);

    if (index > -1) {
      nodes.splice(index, 1);
      dispatch(setUser({ ...user, nodes }));
      setReload(true);
    }
  };

  const createNode = async () => {
    const templateNode = redditTemplate;
    setSelectedConfig(templateNode);
  };

  return {
    selectedConfig,
    setSelectedConfig,
    redditConfigs,
    handleClick,
    saveNode,
    deleteNode,
    createNode,
    user,
  };
}

export function Home() {
  const {
    selectedConfig,
    setSelectedConfig,
    redditConfigs,
    createNode,
    saveNode,
    user,
  } = useRedditLogic();

  const itemLoad: Item = {
    id: 0,
    title: 'new Item?',
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
          id: config.id,
          title: config.username,
          selected: true,
        });
      }

      if (parsedData.length > 0) {
        console.log('Cur Selected');
        console.log(selected);
        parsedData[0].selected = true;
        setSelected(parsedData[0]);
        setParsedItems(parsedData);
      }
    };
    parseConfigs();
  }, []);

  const refreshItem = () => {
    const config = redditConfigs.find((c) => c.id === selected.id);
    if (!config) return;
    setSelectedConfig(config);
  };

  const onChange = (id: number) => {
    const items = [...parsedItems];
    const foundItem = items.find((item) => item.id === id);
    if (!foundItem) return;

    const config = redditConfigs.find((c) => c.id === foundItem.id);
    setSelected(foundItem);
    setSelectedConfig(config!); //Force Unwrap because we know it exists
  };

  if (selectedConfig.id < -2 || parsedItems.length === 0)
    return <div>Invalid</div>;
  else
    return (
      <StyledHome>
        <ControlsContainer>
          <DropDown
            items={parsedItems}
            selected={selected}
            onChange={onChange}
          />
          <ButtonContainer>
            <IconButton onClick={() => {}}>
              <FontAwesomeIcon icon={faTrashAlt} size="1x" color="#FFF" />
            </IconButton>
            <IconButton onClick={refreshItem}>
              <FontAwesomeIcon icon={faUndo} size="1x" color="#FFF" />
            </IconButton>
            <IconButton onClick={createNode}>
              <FontAwesomeIcon icon={faPlus} size="1x" color="#FFF" />
            </IconButton>

            <IconButton onClick={saveNode}>
              <FontAwesomeIcon icon={faSave} size="1x" color="#FFF" />
            </IconButton>
          </ButtonContainer>
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

const IconButton = styled.div`
  display: inline;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 20px 0; */
  margin-right: 5px;
  transition: 250ms all;
  &:hover .fa-trash-alt {
    color: rgba(255, 0, 0, 0.8);
  }
  /* &:hover .fa-save {
    color: rgba(0, 255, 0, 0.8);
  } */
  background-color: ${(props) => props.theme.input.backCol};
  :hover {
    background-color: ${(props) => props.theme.input.activeCol};
    cursor: pointer;
  }
  @media (max-width: 812px) {
    width: 50px;
    height: 45px;
    svg {
      padding-top: 10px;
    }
  }
`;
