import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ModalPopupProps {
  title: string;
  design: any;
  children: ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
    right: 30px;
    top: 30px;
    position: absolute;
  }

  span:hover {
    cursor: pointer;
    color: ${(p) => p.theme.navbar.title};
  }
`;

const DialogContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
`;

const DialogBox = styled.div`
  position: fixed;
  width: 450px;
  max-height: 90%;
  overflow-y: auto;
  background-color: #202225;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 15px;

  .childItems {
    margin: 10px;

    & > *:not(:last-child) {
      margin-bottom: 15px;
    }
  }
`;
