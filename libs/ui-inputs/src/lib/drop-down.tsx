import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

export interface Item {
  id: number;
  title: string;
  selected: boolean;
}

/* eslint-disable-next-line */
export interface DropDownProps {
  items: Item[];
  selected: Item;
  setSelected: any;
}

const StyledDropDown = styled.div`
  width: 200px;
  /* height: 60px; */
  font-size: 18px;
  transition: all 2s ease-in;
  user-select: none;
`;

export function DropDown({ items, selected, setSelected }: DropDownProps) {
  const [isOpen, setOpen] = useState(false);

  const setItem = (id: number) => {
    setSelected(items[id]);
    setOpen(false);
  };

  return (
    <StyledDropDown>
      <SelectedItem onClick={() => setOpen(!isOpen)}>
        {selected.title}
        <FontAwesomeIcon
          pull={'right'}
          icon={isOpen ? faCaretUp : faCaretDown}
          size="1x"
          color="#FFF"
        />
      </SelectedItem>
      {isOpen && (
        <HiddenContainer>
          {items.map((item) => {
            if (item.id !== selected.id)
              return (
                <DropDownItem onClick={() => setItem(item.id)} key={item.id}>
                  {item.title}
                </DropDownItem>
              );
            return;
          })}
        </HiddenContainer>
      )}
    </StyledDropDown>
  );
}

const HiddenContainer = styled.div`
  /* margin-top: 10px; */
  /* height: 100px; */
  z-index: 100;
  position: absolute;
  width: 200px;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  align-items: center; */
`;

const DropDownItem = styled.div`
  text-align: center;
  padding-right: 25px;
  /* margin: 10px 0 0 0; */
  padding: 5px;
  z-index: 10;
  background-color: #1a1a1d;
  :hover {
    cursor: pointer;
    background-color: #141617;
  }
`;

const SelectedItem = styled.div`
  text-align: center;
  border: 2px solid #141617;
  border-radius: 3px;
  background-color: #1a1a1d;
  padding-right: 10px;
  /* box-shadow: 0px 1px 25px 0px rgba(0, 0, 0, 1); */
  div {
    color: pink;
  }
`;
