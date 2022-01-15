import {
  createRedditConfig,
  deleteRedditConfig,
  RedditConfigDto,
  updateRedditConfig,
} from '@labmaker/wrapper';
import { RootState } from '../../store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { redditTemplate } from '../LoadingTypes';
import { findItem, parseConfigs } from '../helpers';
import { Item } from '@labmaker/ui';
import { toast } from 'react-toastify';
import { addNode, deleteNode, setNode } from '../slices/userSlice';

export function useRedditLogic() {
  const [config, setConfig] = useState<RedditConfigDto>(redditTemplate);
  const [loading, setLoading] = useState(true); //No Fetching is done so we will never be "loading"
  const [newConfig, setNewConfig] = useState(false);
  const [parsedConfigs, setParsedConfigs] = useState<Item[]>([]);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    if (user.nodes.length === 0) return;
    setParsedConfigs(parseConfigs(user.nodes));
    setConfig(user.nodes[0]); //bug: Causes first config to show on save
    setLoading(false);
  }, [user.nodes]);

  const handleCreate = () => {
    setConfig({ ...redditTemplate, userId: user.id });
    setNewConfig(true);
  };

  const handleSave = async () => {
    console.log('Saving');
    const prevConfig = user.nodes.find((c) => c.id === config?.id);
    if (prevConfig === config || !config)
      return toast.info(`Edit the config before saving`, {});

    if (newConfig) {
      try {
        const { data: savedConfig } = await createRedditConfig(config);
        dispatch(addNode([savedConfig]));
        return toast.success(`Created ${config.username}`);
      } catch (err) {
        return console.log(err);
      }
    }

    try {
      const { data: updatedConfig } = await updateRedditConfig(config);
      if (!updatedConfig) return;
      dispatch(setNode(updatedConfig));
      toast.success(`Saved ${updatedConfig.username}`);
    } catch (err) {
      console.log(err);
    }

    return;
  };

  const handleDelete = async () => {
    if (!config) return;

    try {
      await deleteRedditConfig(config.id);
      dispatch(deleteNode(config.id));
      if (user.nodes.length > 1) {
        setConfig(user.nodes[0]); //This may error if no configs present (find another way to handle it)
      } else {
        setConfig(redditTemplate);
      }

      toast.success(`Deleted ${config.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefresh = () => {
    const prevConfig = user.nodes.find((c) => c.id === config?.id);
    if (!prevConfig) return;
    setConfig(prevConfig);
  };

  const handleChange = (id: number | string) => {
    if (typeof id === 'string') return;
    const foundConfig = findItem(parsedConfigs, user.nodes, id);
    if (!foundConfig) return;
    setConfig(foundConfig);
  };

  return {
    config,
    setConfig,
    parsedConfigs,
    loading,
    handleCreate,
    handleSave,
    handleDelete,
    handleRefresh,
    handleChange,
  };
}
