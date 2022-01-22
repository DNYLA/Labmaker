import { Content, Page } from '@labmaker/ui';
import { toast } from 'react-toastify';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface TutorProps {}

export function Tutor(props: TutorProps) {
  return (
    <Page>
      <Content>
        <h1>Welcome to Tutor!</h1>
      </Content>
    </Page>
  );
}
