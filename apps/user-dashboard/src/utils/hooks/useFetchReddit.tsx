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

export function useFetchReddit() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);
  const [selectedConfig, setSelectedConfig] = useState(user.nodes[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.nodes.length === 0) {
      const templateConf = redditTemplate;
      setSelectedConfig(templateConf);
    }

    setLoading(false);
  }, [user.nodes]);

  useEffect(() => {
    LabmakerSocket?.on('config', (data) => {
      const configObj: RedditConfigDto = JSON.parse(data);
      const oldConfig = user.nodes.find((c) => c.id === configObj.id);
      if (oldConfig === configObj) return; //This means the user Invoked the update request
      console.log(oldConfig);
      if (!selectedConfig || selectedConfig.id === configObj.id) {
        toast.info(
          `${selectedConfig.username} has been updated! Hit the refresh button for the latest edit.`
        );
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
      toast.info('Edit the config before saving', {});
      return;
    }
    if (!selectedConfig.newNode) {
      dispatch(setConfig(selectedConfig)); //Need to set this here as Once Labmaker.Update() is  called the socket is notified but still thinks we are using the old config
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
    loading,
  };
}
