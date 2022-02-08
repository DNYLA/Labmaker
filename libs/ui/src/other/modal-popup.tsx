import { ReactNode } from 'react';
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
  if (open) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = 'unset';

  return (
    <StyledTagInputBox>
      {design && (
        <StyledSpan onClick={() => setOpen && setOpen(true)}>
          {design}
        </StyledSpan>
      )}

      {open && (
        <StyledDialogContainer>
          <StyledDialogBox>
            <StyledTitleContainer>
              <h1>{title}</h1>
              {setOpen && <span onClick={() => setOpen(false)}>X</span>}
            </StyledTitleContainer>

            <div className="childItems">{children}</div>
          </StyledDialogBox>
        </StyledDialogContainer>
      )}
    </StyledTagInputBox>
  );
}

export const StyledTagInputBox = styled.div`
  color: #eee;
`;

const StyledSpan = styled.span`
  :hover {
    color: ${(p) => p.theme.navbar.title};
    cursor: pointer;
  }
`;

const StyledTitleContainer = styled.span`
  padding-top: 5px;
  margin: 0 10px;

  h1 {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }

  /* X Button */
  span {
    position: absolute;
    right: 30px;
    top: 28px;
  }

  span:hover {
    cursor: pointer;
    color: ${(p) => p.theme.navbar.title};
  }
`;

export const StyledDialogContainer = styled.div`
  position: fixed;
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

export const StyledDialogBox = styled.div`
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
