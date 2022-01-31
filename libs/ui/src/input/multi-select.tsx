import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
  faCheckCircle,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StringifyOptions } from 'querystring';
import { InfoTitle } from './info-box';
import { Item } from './drop-down';

export interface IOnMultiSelectChange {
  (item: string | number): void;
}

/* eslint-disable-next-line */
export interface MultiSelectProps {
  title?: string;
  infoMessage?: string | React.ReactNode;
  items: Item[];
  selected: string[];
  onChange: IOnMultiSelectChange;
}

export function MultiSelect({
  title,
  infoMessage,
  items,
  selected,
  onChange,
}: MultiSelectProps) {
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  // const [selected, setSelected] = useState<Item>({
  //   value: 0,
  //   label: 'Select...',
  // });
  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    const selecItems = new Array<Item>();
    for (let i = 0; i < selected.length; i++) {
      const item = selected[i];
      const foundItem = items.find((itm) => itm.value === item);

      if (foundItem) selecItems.push(foundItem);
    }
    const filteredItems = items.filter((item) => !selecItems.includes(item));
    console.log(filteredItems);
    console.log(selecItems);
    setSelectedItems(selecItems);
    setFilteredItems(filteredItems);

    let inputStr = 'Select...';
    selecItems.forEach((item, i) => {
      if (i === 0) inputStr = `${item.label}`;
      else inputStr = `${inputStr}, ${item.label}`;
    });

    setInputValue(inputStr);
  }, [selected, items]);

  const setItem = (id: string | number) => {
    onChange(id);
    const newItem = items.find((item) => item.value === id);
    if (!newItem) return;
    inputRef.current?.blur();
    // setSelected(newItem);
    // setInputValue(newItem.label);
    setOpen(false);
  };

  const onKeyInput = (inputVal: string) => {
    setOpen(true);
    const alreadyInside = items.find(
      (item) => item.label.toLowerCase() === inputVal
    );
    // if (alreadyInside && selected.value === alreadyInside.value) {
    //   setFilteredItems(items);
    //   setInputValue(inputVal);
    //   return;
    // }
    const fItems = items.filter((item) =>
      item.label.toLowerCase().includes(inputVal)
    );
    // setFilteredItems(fItems);
    setInputValue(inputVal);
  };

  const updateOpen = () => {
    // setFilteredItems(items);
    // if (isOpen && selected.label !== inputValue) {
    //   setInputValue(selected.label);
    // }
    setOpen(!isOpen);
  };

  const handleInputClick = () => {
    setInputValue('');
    // setFilteredItems(items);
    setOpen(true);
  };

  // const handleCloseClick = () => {
  //   if (isOpen) {
  //     setInputValue(selected.label);
  //     setOpen(false);
  //   } else {
  //     setInputValue('');
  //     setOpen(true);
  //   }
  //   setFilteredItems(items);
  // };

  const handleClose = () => {
    // setInputValue(selected.label);
    setOpen(false);
  };

  return (
    <>
      {title && <InfoTitle title={title} infoMessage={infoMessage} />}
      <StyledMultiSelect
        tabIndex={0}
        // onMouseDown={handleCloseClick} //Bug Where Clicking an item closes menu
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
            {selectedItems.map((item) => {
              return (
                <DropDownItem
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setItem(item.value)}
                  key={item.value}
                >
                  {item.label}
                  <FontAwesomeIcon className="checkMark" icon={faCheckCircle} />
                </DropDownItem>
              );
            })}
            {filteredItems.map((item) => {
              // if (item.value !== selected.value)
              return (
                <DropDownItem
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setItem(item.value)}
                  key={item.value}
                >
                  {item.label}
                </DropDownItem>
              );
            })}
          </HiddenContainer>
        )}
      </StyledMultiSelect>
    </>
  );
}

const StyledInput = styled.input`
  padding-left: 10px;
  padding-right: 25px;
  color: white;
  font-family: 'Archivo Black';
  width: 100%;
  height: 30px;
  background-color: ${(p) => p.theme.input.backCol};
  border-radius: 5px;
  border: 0;
  font-size: 16px;
  transition: opacity 340ms ease;

  :focus {
    background-color: ${(p) => p.theme.input.activeCol};
    outline: 0;
  }
`;

const HiddenContainer = styled.div`
  z-index: 100;
  position: absolute;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: ${(p) => p.theme.input.backCol};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  // Don't know whats causing the children to go out of the containers borderRadius - quick fix
  & > *:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const DropDownItem = styled.div`
  padding: 10px;
  font-family: 'Roboto';
  font-size: 16px;
  cursor: pointer;

  :hover {
    font-weight: bold;
    background-color: ${(p) => p.theme.input.activeCol};
  }

  .checkMark {
    float: right;
  }
`;

const StyledMultiSelect = styled.div`
  position: relative;
  width: 100%;
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
