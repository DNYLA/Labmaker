import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ModalPopupProps {
  title?: string;
  design?: any;
  children: ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalPopup({
  title,
  design,
  children,
  open = true,
  setOpen,
}: ModalPopupProps) {
  return (
    <StyledTagInputBox>
      {design && (
        <StyledSpan onClick={() => setOpen && setOpen(true)}>
          {design}
        </StyledSpan>
      )}

      {open && (
        <DialogContainer>
          <DialogBox>
            <TitleContainer>
              <h1>{title}</h1>
              {setOpen && <span onClick={() => setOpen(false)}>X</span>}
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
  justify-content: center;
  align-content: center;
  padding-top: 5px;

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
  z-index: 1;
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

export interface MultiModalProps {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MultiModalWrapper({
  children,
  open,
  setOpen,
}: MultiModalProps) {
  if (open) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = 'unset';

  return (
    <div>
      {open && (
        <StyledMultiModalWrapper className="multi-modal">
          <div>
            <StyledRel>
              <StyledClose onClick={() => setOpen && setOpen(false)}>
                X
              </StyledClose>
            </StyledRel>

            {children}
          </div>
        </StyledMultiModalWrapper>
      )}
    </div>
  );
}

const StyledRel = styled.div`
  position: relative;
  top: 0px;
  left: calc(100% + 20px);
`;

const StyledClose = styled.span`
  position: fixed;
  font-size: 28px;
  text-shadow: 1px 1px 4px #000;
  z-index: 3;
  cursor: pointer;
`;

const StyledMultiModalWrapper = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 0;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  padding: 25px;
  z-index: 1;

  & div > ${StyledTagInputBox} {
    margin-bottom: 25px;
  }

  ${DialogContainer} {
    display: unset;
    position: unset;
    top: unset;
    bottom: unset;
    left: unset;
    right: unset;
    max-height: unset;
    background: transparent;
  }

  ${DialogBox} {
    position: unset;
    max-height: unset;
  }
`;
