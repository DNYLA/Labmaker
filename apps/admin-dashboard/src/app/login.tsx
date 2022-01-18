import React, { useEffect } from 'react';
import { loginURL } from '@labmaker/wrapper';
import styled from 'styled-components';
import { toast } from 'react-toastify';

export function LoginPage() {
  const redirect = () => {
    console.log(loginURL);
    window.location.href = loginURL();
  };

  return (
    <StyledLogin>
      <h1>You aren't currently logged in!</h1>
      <CenterDiv>
        <LoginButton onClick={redirect}>Login</LoginButton>
      </CenterDiv>
    </StyledLogin>
  );
}

const StyledLogin = styled.div`
  h1 {
    text-align: center;
    margin: 25px 0px;
  }
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  button {
    margin-right: 25px;
  }
`;

const LoginButton = styled.button`
  width: 50%;
  height: 28px;
  border: none;
  background-color: #313c4b;
  border-radius: 5px;
  justify-content: center;
  color: white;
  font-family: 'Roboto';
  font-size: 18px;
  outline: none;
  transition: 0.5s;

  :active {
    border: none;
  }

  :hover {
    background-color: #455366;
    transition: 0.5s;
    cursor: pointer;
  }
`;
