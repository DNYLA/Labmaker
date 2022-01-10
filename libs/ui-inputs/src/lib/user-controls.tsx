import { IconButton } from './utils/styles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSave,
  faTrashAlt,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';

interface IOnEvent {
  (): void;
}

/* eslint-disable-next-line */
export interface UserControlsProps {
  onDelete?: IOnEvent;
  onRefresh?: IOnEvent;
  onCreate?: IOnEvent;
  onSave?: IOnEvent;
}

export function UserControls({
  onDelete,
  onRefresh,
  onCreate,
  onSave,
}: UserControlsProps) {
  return (
    <ButtonContainer>
      {onDelete && (
        <IconButton onClick={onDelete}>
          <FontAwesomeIcon icon={faTrashAlt} size="1x" color="#FFF" />
        </IconButton>
      )}
      {onRefresh && (
        <IconButton onClick={onRefresh}>
          <FontAwesomeIcon icon={faUndo} size="1x" color="#FFF" />
        </IconButton>
      )}
      {onCreate && (
        <IconButton onClick={onCreate}>
          <FontAwesomeIcon icon={faPlus} size="1x" color="#FFF" />
        </IconButton>
      )}
      {onSave && (
        <IconButton onClick={onSave}>
          <FontAwesomeIcon icon={faSave} size="1x" color="#FFF" />
        </IconButton>
      )}
    </ButtonContainer>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
