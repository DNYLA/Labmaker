import styled from 'styled-components';
import { StyledDialogBox, StyledDialogContainer, StyledTagInputBox } from '..';

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
  position: fixed;
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

  ${StyledDialogContainer} {
    display: unset;
    position: unset;
    top: unset;
    bottom: unset;
    left: unset;
    right: unset;
    max-height: unset;
    background: transparent;
  }

  ${StyledDialogBox} {
    position: unset;
    max-height: unset;
  }
`;
