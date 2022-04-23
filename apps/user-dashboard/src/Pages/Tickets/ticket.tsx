import moment from 'moment';
import styled from 'styled-components';

interface TicketContainerProps {
  subject: string;
  type: string;
  budget: number;
  due: Date;
  onClick?: (e: any) => void;
}

export function TicketContainer({
  subject,
  type,
  budget,
  due,
  onClick,
}: TicketContainerProps) {
  return (
    <TicketContainerStyle onClick={onClick}>
      <p className="budget">${budget}</p>
      <h4>
        {subject} {type}
      </h4>
      <p>Due {moment(due, 'YYYYMMDD').fromNow()}</p>
    </TicketContainerStyle>
  );
}

const TicketContainerStyle = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  width: 25%;
  height: 100px;
  padding: 10px;
  margin: 10px;
  background-color: ${(p) => p.theme.input.backCol};
  border: 2px solid transparent;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  user-select: none;

  .budget {
    color: lightgreen;
  }

  &:hover {
    background-color: ${(p) => p.theme.input.activeCol};
    border: 2px solid white;
  }
`;
