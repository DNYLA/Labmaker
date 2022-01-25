import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ModalPopupProps {
  title: string;
  design: any;
  children: any;
  open: any;
  setOpen: any;
}

//Currently Broken Fix CSS
export function ModalPopup({
  title,
  design,
  children,
  open,
  setOpen,
}: ModalPopupProps) {
  return (
    <StyledTagInputBox>
      <StyledSpan onClick={() => setOpen(true)}>{design}</StyledSpan>
      {open && (
        <DialogContainer>
          <DialogBox>
            <TitleContainer>
              <h1>{title}</h1>
              <span onClick={() => setOpen(false)}>X</span>
            </TitleContainer>
            <div className="childItems">{children}</div>
          </DialogBox>
        </DialogContainer>
      )}
    </StyledTagInputBox>
  );
}

const StyledTagInputBox = styled.div`
  color: #eee;
`;

const StyledSpan = styled.span`
  :hover {
    color: ${(p) => p.theme.navbar.title};
    cursor: pointer;
  }
`;

const TitleContainer = styled.span`
  display: flex;
  align-items: center;
  padding-top: 5px;
  justify-content: center;
  align-content: center;

  h1 {
    margin-bottom: 10px;
  }

  span {
    left: 95%;
    top: 3%;
    position: absolute;
  }

  span:hover {
    cursor: pointer;
    color: ${(p) => p.theme.navbar.title};
  }
`;

const DialogContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: absolute;
  transform: 0;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const DialogBox = styled.div`
  position: fixed;
  width: 30%;
  min-height: 30%;
  background-color: #202225;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  padding-bottom: 30px;

  .childItems {
    margin: 10px;
  }
`;
