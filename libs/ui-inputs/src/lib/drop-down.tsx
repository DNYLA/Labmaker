import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export interface Item {
  value: number;
  label: string;
  selected: boolean;
}

interface IOnChange {
  (id: number): void;
}

/* eslint-disable-next-line */
export interface DropDownProps {
  items: Item[];
  onChange: IOnChange;
}

const StyledDropDown = styled.div`
  width: 200px;
  font-size: 18px;
  transition: all 2s ease-in;
  user-select: none;
`;

export function DropDown({ items, onChange }: DropDownProps) {
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selected, setSelected] = useState<Item>(items[0]);
  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    setInputValue(selected.label);
  }, [selected]);

  const setItem = (id: number) => {
    console.log('Running');
    const newItem = items.find((item) => item.value === id);
    if (!newItem) return;
    setSelected(newItem);
    onChange(id);
    inputRef.current?.blur();
    setOpen(false);
  };

  const onKeyInput = (inputVal: string) => {
    setOpen(true);
    const alreadyInside = items.find(
      (item) => item.label.toLowerCase() === inputVal
    );
    if (alreadyInside && selected.value === alreadyInside.value) {
      console.log('Already inside');
      setFilteredItems(items);
      setInputValue(inputVal);
      return;
    }
    const fItems = items.filter((item) =>
      item.label.toLowerCase().includes(inputVal)
    );
    setFilteredItems(fItems);
    setInputValue(inputVal);
  };

  const updateOpen = () => {
    setFilteredItems(items);
    if (isOpen && selected.label !== inputValue) {
      setInputValue(selected.label);
    }
    setOpen(!isOpen);
  };

  const handleInputClick = () => {
    setInputValue('');
    setFilteredItems(items);
    setOpen(true);
  };

  const handleClose = () => {
    setInputValue(selected.label);
    setOpen(false);
  };

  return (
    <StyledDropDown
      tabIndex={0}
      onFocus={handleInputClick}
      onBlur={handleClose}
    >
      <SelectedItem>
        {/* {selected.title} */}
        <StyledInput
          value={inputValue}
          ref={inputRef}
          onChange={(e) => onKeyInput(e.target.value.toLowerCase())}
        />
        <FontAwesomeIcon
          pull={'right'}
          icon={isOpen ? faCaretUp : faCaretDown}
          size="1x"
          color="#FFF"
          onClick={updateOpen}
        />
      </SelectedItem>
      {isOpen && (
        <HiddenContainer>
          {filteredItems.map((item) => {
            if (item.value !== selected.value)
              return (
                <DropDownItem
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setItem(item.value)}
                  key={item.value}
                >
                  {item.label}
                </DropDownItem>
              );
            return <div key={item.value}></div>;
          })}
        </HiddenContainer>
      )}
    </StyledDropDown>
  );
}

const StyledInput = styled.input`
  text-align: center;
  font-size: 18px;
`;

const HiddenContainer = styled.div`
  z-index: 100;
  position: absolute;
  width: 200px;
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
  /* text-align: center;
  border: 2px solid #141617;
  border-radius: 3px;
  background-color: #1a1a1d;
  padding-right: 10px;
  display: flex; */
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    color: pink;
  }
  svg {
    /* display: flex; */
    /* position: absolute; */
    /* left: 50%; */
    float: right;
    padding-top: 0;
    /* float: right; */
  }
  input {
    padding-left: 10px;
    color: white;
    font-family: 'Lexend Deca';
    width: 100%;
    height: 30px;
    background: #1a1a1d;
    border-radius: 5px;
    border: 2px solid #141617;
    /* border-radius: 5px; */
    transition: 340ms;
    :focus {
      opacity: 80%;
      outline: 0;
      transition: 340ms;
    }
  }
`;
