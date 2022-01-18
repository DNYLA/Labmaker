import { Content, Page } from '@labmaker/ui';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface IndexProps {}

export function Tickets(props: IndexProps) {
  const navigate = useNavigate();
  const handleCreate = () => navigate('/create');
  return (
    <Page>
      <Section>
        <h1>You Don't have Any Previous Tickets!</h1>
        <p>
          Dont worry, we've made the process super simple, just click below to
          get started.
        </p>
        <Button onClick={handleCreate}>Create Ticket</Button>
      </Section>
    </Page>
  );
}

const Section = styled(Content)`
  /* width: 200vh; */
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  cursor: pointer;
  margin-top: 10px;
  background-color: ${(p) => p.theme.input.backCol};
  color: #fff;
  font-size: 20px;
  font-family: 'Archivo Black', 'Roboto', sans-serif;
  width: fit-content;
  padding: 0px 15px;
  border: none;
  border-radius: 4px;
  :hover {
    background-color: #1a1a1a;
  }
`;
