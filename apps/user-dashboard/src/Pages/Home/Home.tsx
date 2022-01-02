import { ComboContainer } from 'apps/user-dashboard/src/assets/styles';
import { AccountSettings } from 'apps/user-dashboard/src/Pages/Home/AccountSettings';
import { MainSettings } from 'apps/user-dashboard/src/Pages/Home/main-settings';
import React from 'react';
import styled from 'styled-components';
interface HomeProps {}

const StyledHome = styled.div`
  margin: 0 250px;
`;

export function Home({}: HomeProps) {
  return (
    <StyledHome>
      <ComboContainer>
        <AccountSettings />
        <MainSettings />
      </ComboContainer>
    </StyledHome>
  );
}
