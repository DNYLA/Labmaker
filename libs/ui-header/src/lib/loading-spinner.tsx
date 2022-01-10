import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface LoadingSpinnerProps {
  loading: boolean | undefined;
  message?: string;
  icon?: IconDefinition;
  size?: SizeProp;
  fixed?: boolean;
}

const StyledLoadingSpinner = styled.div`
  color: white;
`;

export function LoadingSpinner({
  loading,
  message,
  icon,
  size,
  fixed,
}: LoadingSpinnerProps) {
  return (
    <StyledLoadingSpinner>
      {loading && (
        <LoadingStyle>
          <FontAwesomeIcon
            icon={icon ? icon : faSpinner}
            className={fixed ? '' : 'fa-spin'}
            size={size ? size : '2x'}
          />
          <h1>{message}</h1>
        </LoadingStyle>
      )}
    </StyledLoadingSpinner>
  );
}

const LoadingStyle = styled.div`
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
  z-index: 1500000;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  h1 {
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
  a {
    color: white;
  }
`;
