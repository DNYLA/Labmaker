import { ComboContainer } from '../../assets/styles';
import { AccountSettings } from './account-settings';
import { MainSettings } from './main-settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRemoveFormat,
  faSave,
  faTrash,
  faTrashAlt,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DropDown } from '@labmaker/ui-inputs';
// interface HomeProps {}

const StyledHome = styled.div`
  margin: 0 250px;
`;

export function Home() {
  const items = [
    { id: 0, title: 'Dans Config', selected: true, key: 'DanID' },
    { id: 1, title: 'Bobs Config', selected: true, key: 'BobID' },
    { id: 2, title: 'Jim', selected: true, key: 'JimID' },
    { id: 3, title: 'Larry', selected: true, key: 'JimID' },
    { id: 4, title: 'Bobby', selected: true, key: 'JimID' },
    { id: 5, title: 'Bibb', selected: true, key: 'JimID' },
  ];

  const [selected, setSelected] = useState(items[0]);
  return (
    <StyledHome>
      <ControlsContainer>
        <DropDown items={items} selected={selected} setSelected={setSelected} />
        <ButtonContainer>
          <IconButton>
            <FontAwesomeIcon icon={faTrashAlt} size="1x" color="#FFF" />
          </IconButton>
          <IconButton>
            <FontAwesomeIcon icon={faUndo} size="1x" color="#FFF" />
          </IconButton>

          <IconButton>
            <FontAwesomeIcon icon={faSave} size="1x" color="#FFF" />
          </IconButton>
        </ButtonContainer>
      </ControlsContainer>
      <ComboContainer>
        <AccountSettings />
        <MainSettings />
      </ComboContainer>
    </StyledHome>
  );
}

const ControlsContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding-top: 25px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IconButton = styled.div`
  display: inline;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 20px 0; */
  margin-right: 5px;
  transition: 250ms all;
  &:hover .fa-trash-alt {
    color: rgba(255, 0, 0, 0.8);
  }
  /* &:hover .fa-save {
    color: rgba(0, 255, 0, 0.8);
  } */
  background-color: ${(props) => props.theme.input.backCol};
  :hover {
    background-color: ${(props) => props.theme.input.activeCol};
    cursor: pointer;
  }
  @media (max-width: 812px) {
    width: 50px;
    height: 45px;
    svg {
      padding-top: 10px;
    }
  }
`;
