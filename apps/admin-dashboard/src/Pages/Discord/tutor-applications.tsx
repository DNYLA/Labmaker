import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  DropDown,
  InputBox,
  Item,
  Page,
  SettingsContainer,
  SwitchToggle,
} from '@labmaker/ui';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';
import {
  ChannelType,
  CreateApplication,
  PartialGuildChannel,
  PartialRole,
  TutorApplication,
} from '@labmaker/shared';
import { getApplications, getChannels, getRoles } from '@labmaker/wrapper';
import { parseChannels, parseRoles } from '../../utils/helpers';
import { useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface TutorApplicationsProps {}

export function TutorApplications(props: TutorApplicationsProps) {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    if (!id) return;
    getApplications(id)
      .then(({ data }) => {
        setApplications(data);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }, [id]);

  return (
    <Page>
      {applications.length > 0 && (
        <div>
          {applications.map((app) => {
            return (
              //Covert to Modal OnClick Which allows you to accept or Decline
              <div>
                <p>User ID: {app.userId}</p>
                <p>Message: {app.applicationMessage}</p>
                <p>Vouches: {app.vouchesLink}</p>
                <p>Reddit Username: {app.redditUsername}</p>
                <p>Subejcts: {app.subjects.toString()}</p>
                <p>Created: {app.createdAt}</p>
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
}

const StyledSpan = styled.span`
  padding-right: 5px;
  margin-left: 2px;
  margin-bottom: 5px;
`;
