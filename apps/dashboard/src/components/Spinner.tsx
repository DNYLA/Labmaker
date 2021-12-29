import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

type SpinnerProps = {
  loading: boolean | undefined;
  message?: string;
  icon?: IconDefinition;
  size?: SizeProp;
  fixed?: boolean;
};

export const Spinner = ({
  loading,
  message,
  icon,
  size,
  fixed,
}: SpinnerProps) => {
  if (loading) {
    return (
      <LoadingStyle>
        <FontAwesomeIcon
          icon={icon ? icon : faSpinner}
          className={fixed ? '' : 'fa-spin'}
          size={size ? size : '2x'}
        />
        <h1>{message}</h1>
      </LoadingStyle>
    );
  } else {
    return <div></div>;
  }
};

const LoadingStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  transform: 0;
  z-index: 15;

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
