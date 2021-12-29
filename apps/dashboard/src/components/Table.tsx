import { LogDto } from 'labmaker-api-wrapper';
import { useState } from 'react';
import styled from 'styled-components';
const moment = require('moment');

type LogProps = {
  logs: LogDto[];
};

type DateColumnProps = {
  createdAt?: string;
};

const DateColumn = ({ createdAt }: DateColumnProps) => {
  //Change CreatedAt to non optional in API-Wrapper
  if (!createdAt) {
    return <td>Unknown Time</td>;
  }

  //Installing MommentJS is Overkill
  //When i have time ill create a function for it as it shouldnt be too hard.
  const date = new Date(createdAt);
  const dateString = moment(date, 'YYYYMMDD').fromNow();
  return <td>{dateString}</td>;
};

export const Table = ({ logs }: LogProps) => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <StyledTable>
      <tbody>
        <tr>
          <th>User</th>
          <th>
            <span onClick={() => setIsHidden(!isHidden)}>Message</span>
          </th>
          <th>Subreddit</th>
          <th>Post</th>
          <th>Time</th>
        </tr>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>
              <a
                href={`https://reddit.com/u/${log.username}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {log.username}
              </a>
            </td>
            <td>
              {isHidden ? (
                <span onClick={() => setIsHidden(!isHidden)}>
                  Click To View
                </span>
              ) : (
                <span onClick={() => setIsHidden(!isHidden)}>
                  {log.message}
                </span>
              )}
            </td>
            <td>
              <a
                href={`https://reddit.com/r/${log.subreddit}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {log.subreddit}
              </a>
            </td>
            <td>
              <a
                href={`https://reddit.com/r/${log.subreddit}/comments/${log.subId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Here
              </a>
            </td>

            <DateColumn createdAt={log.createdAt} />
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

const StyledTable = styled.table`
  a {
    text-decoration: none;
    color: #0e48e9;
    transition: all 0.2s;
  }

  a:hover {
    color: #0ea4e9;
  }
  span {
    :hover {
      cursor: pointer;
    }
  }
  transition: all 1.5s ease-in-out;
`;
