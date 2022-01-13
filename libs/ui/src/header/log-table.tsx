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

export function LogTable({ logs, title }: LogTableProps) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <TableWrapper>
      <Table>
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
                <span
                  onClick={() => setIsHidden(!isHidden)}
                  // onMouseEnter={() => setIsHidden(false)}
                  // onMouseLeave={() => setIsHidden(true)}
                >
                  {isHidden ? 'Click To View' : log.message}
                </span>
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
      </Table>
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 5px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 550px;
  text-align: center;
  border-spacing: 0;
  border-radius: 5px;

  tbody {
    width: 100%;

    th,
    td {
      padding: 12px 5px;
    }

    tr {
      transition: background-color 150ms ease-in;
    }

    tr:nth-child(odd) {
      background-color: ${(p) => p.theme.input.backCol};
    }

    tr:hover {
      background-color: ${(p) => p.theme.input.activeCol};
    }
  }

  span {
    :hover {
      cursor: pointer;
    }
  }

  a {
    text-decoration: none;
    color: #00afff;
    transition: color 200ms ease-in-out;

    :hover {
      color: #0ea4e9b7;
    }
  }
`;
