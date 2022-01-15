import { RootState } from '../../store';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getLogs, LogDto } from '@labmaker/wrapper';
import { Item } from '@labmaker/ui';
import { parseConfigs } from '../helpers';

export function useFetchLogs() {
  const [logs, setLogs] = useState<LogDto[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [parsedConfigs, setParsedConfigs] = useState<Item[]>([]);
  const user = useSelector((state: RootState) => state.user.value);

  const fetchLogs = useCallback((id: string) => {
    setLoading(true);
    getLogs(id)
      .then(({ data }) => {
        setLogs(data);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => setTimeout(() => setLoading(false), 150));
  }, []);

  useEffect(() => {
    if (user.nodes.length === 0) return;
    fetchLogs(user.nodes[0].id.toString());
    setParsedConfigs(parseConfigs(user.nodes));
  }, [fetchLogs, user.nodes]);

  const handleChange = (id: number | string) => {
    const items = [...parsedConfigs];
    const foundItem = items.find((item) => item.value === id);
    const config = user.nodes.find((c) => c.id === foundItem?.value);
    if (!config) return;
    fetchLogs(config.id.toString());
  };

  return { logs, loading, error, parsedConfigs, handleChange };
}
