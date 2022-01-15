import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export interface Item {
  value: number | string;
  label: string;
  selected: boolean;
}

export interface IOnDropDownChange {
  (id: number | string): void;
}

/* eslint-disable-next-line */
export interface DropDownProps {
  items: Item[];
  onChange: IOnDropDownChange;
}

export function DropDown({ items, onChange }: DropDownProps) {
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selected, setSelected] = useState<Item>(items[0]);
  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    setInputValue(selected.label);
  }, [selected.label]);

  useEffect(() => {
    setSelected(items[0]);
  }, [items]);

  const setItem = (id: number | string) => {
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

  const handleCloseClick = () => {
    if (isOpen) {
      setInputValue(selected.label);
      setOpen(false);
    } else {
      setInputValue('');
      setOpen(true);
    }
    setFilteredItems(items);
  };

  const handleClose = () => {
    setInputValue(selected.label);
    setOpen(false);
  };

  return (
    <StyledDropDown
      tabIndex={0}
      onMouseDown={handleCloseClick}
      onFocus={handleInputClick}
      onBlur={handleClose}
      className={isOpen ? 'open' : ''}
    >
      <SelectedItem>
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
  padding-left: 10px;
  padding-right: 25px;
  color: white;
  font-family: 'Archivo Black';
  width: 100%;
  height: 30px;
  background: #1a1a1d;
  border-radius: 5px;
  border: 2px solid #141617;
  font-size: 16px;
  transition: opacity 340ms ease;

  :focus {
    opacity: 80%;
    outline: 0;
  }
`;

const HiddenContainer = styled.div`
  z-index: 100;
  position: absolute;
  width: 196px;
  border: 2px solid transparent;
  border-top: 0;
`;

const DropDownItem = styled.div`
  padding: 10px;
  z-index: 10;
  background-color: #1a1a1d;
  font-family: 'Roboto';
  font-size: 16px;

  :hover {
    cursor: pointer;
    background-color: #141617;
  }
`;

const StyledDropDown = styled.div`
  position: relative;
  width: 200px;
  font-size: 18px;
  transition: all 200ms ease-in;
  user-select: none;

  &.open {
    ${StyledInput} {
      border-bottom: 0;
      border-radius: 5px 5px 0 0;
    }

    ${HiddenContainer} {
      border-color: #141617;
      border-radius: 0 0 5px 5px;
    }
  }
`;

const SelectedItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  div {
    color: pink;
  }

  svg {
    position: absolute;
    right: 10px;
  }
`;
