import { RootState } from '../../store';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getLogs, LogDto } from '@labmaker/wrapper';
import { Item } from '@labmaker/ui';
import { findItem, parseConfigs } from '../helpers';
// import { useRedditLogic } from './useRedditLogic';

export function useFetchLogs() {
  const [logs, setLogs] = useState<LogDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [parsedConfigs, setParsedConfigs] = useState<Item[]>([]);
  const user = useSelector((state: RootState) => state.user.value);

  const fetchLogs = useCallback((id: number) => {
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
    fetchLogs(user.nodes[0].id);
    setParsedConfigs(parseConfigs(user.nodes));
  }, [fetchLogs, user.nodes]);

  const handleLogsChange = (id: number | string) => {
    if (typeof id === 'string') return;
    const config = findItem(parsedConfigs, user.nodes, id);
    if (!config) return;
    fetchLogs(config.id);
  };

  const addLog = (log: LogDto) => {
    const _logs = [log, ...logs];
    // const _logs = [...logs];
    // _logs.push(log);
    setLogs(_logs);
  };

  return { logs, loading, error, parsedConfigs, handleLogsChange, addLog };
}
