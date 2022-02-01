import React, { useEffect } from 'react';
import { loginURL } from '@labmaker/wrapper';
import styled from 'styled-components';
import { Button } from '.';

export function LoginPage() {
  const redirect = () => {
    console.log(loginURL);
    window.location.href = loginURL();
  };

  return (
    <StyledLoginContainer>
      <StyledLogin>
        <h1>You aren't currently logged in!</h1>

        <CenterDiv>
          <Button onClick={redirect}>Login</Button>
        </CenterDiv>
      </StyledLogin>
    </StyledLoginContainer>
  );
}

const StyledLoginContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const StyledLogin = styled.div`
  margin: 30px;
  max-width: 600px;

  h1 {
    text-align: center;
    margin: 25px 0px;
  }
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;
