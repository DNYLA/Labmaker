import { LogDto } from '@labmaker/wrapper';
import { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

interface DateColumnProps {
  createdAt?: string;
}

export function DateColumn({ createdAt }: DateColumnProps) {
  //Change CreatedAt to non optional in API-Wrapper
  if (!createdAt) {
    return <td>Unknown Time</td>;
  }

  //Installing MommentJS is Overkill
  //When i have time ill create a function for it as it shouldnt be too hard.
  const date = new Date(createdAt);
  const dateString = moment(date, 'YYYYMMDD').fromNow();
  return <td>{dateString}</td>;
}

/* eslint-disable-next-line */
export interface LogTableProps {
  logs: LogDto[];
  title?: string;
}

const StyledLogTable = styled.table`
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
  transition: all 1.5s ease-in-out
  width: 100%;

  tbody {
    width: 100%;
  }
`;

export function LogTable({ logs, title }: LogTableProps) {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <StyledLogTable>
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
              {
                //Hover Toggle seems better but may be annoying so ive commented it out for now
              }
              {isHidden ? (
                <span
                  onClick={() => setIsHidden(!isHidden)}
                  // onMouseEnter={() => setIsHidden(false)}
                  // onMouseLeave={() => setIsHidden(true)}
                >
                  Click To View
                </span>
              ) : (
                <span
                  onClick={() => setIsHidden(!isHidden)}
                  // onMouseEnter={() => setIsHidden(false)}
                  // onMouseLeave={() => setIsHidden(true)}
                >
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
    </StyledLogTable>
  );
}

export default LogTable;
