import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export interface IOnTagChange {
  (updatedValues: string[]): void;
}
/* eslint-disable-next-line */
export interface TagInputBoxProps {
  title: string;
  items: string[];
  onChange: IOnTagChange;
}

//Currently Broken Fix CSS
export function TagInputBox({ title, onChange, items }: TagInputBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (event: any) => {
    console.log(typeof event);
    const value = event.target.value;

    if (event.key === 'Enter' && value) {
      if (items.find((tag) => tag.toLowerCase() === value.toLowerCase()))
        return;

      onChange([...items, value]);
      event.target.value = '';
    } else if (event.key === 'Backspace' && !value) {
      removeTag(items.length - 1);
    }
  };

  const removeTag = (index: number) => {
    const tagsArray = [...items];

    tagsArray.splice(index, 1);
    onChange(tagsArray);
  };

  return (
    <StyledTagInputBox>
      <StyledSpan onClick={() => setIsOpen(true)}>{title}</StyledSpan>
      {isOpen && (
        <DialogContainer>
          <DialogBox>
            <TitleContainer>
              <h1>{title}</h1>
              <span onClick={() => setIsOpen(false)}>X</span>
            </TitleContainer>

            <InputTag>
              <input type="text" onKeyDown={handleKeyDown} />
              <FontAwesomeIcon icon={faPlus} />
            </InputTag>

            <ItemContainers>
              <ul className="tags">
                {items.map((tag, i) => {
                  return (
                    <li className="tags-li" key={i}>
                      {tag} <button onClick={() => removeTag(i)}> x </button>
                    </li>
                  );
                })}
              </ul>
            </ItemContainers>
          </DialogBox>
        </DialogContainer>
      )}
    </StyledTagInputBox>
  );
}

const StyledTagInputBox = styled.div`
  color: #eee;
`;

const StyledSpan = styled.span`
  :hover {
    color: ${(p) => p.theme.navbar.title};
    cursor: pointer;
  }
`;

const TitleContainer = styled.span`
  display: flex;
  align-items: center;
  padding-top: 5px;
  justify-content: center;
  align-content: center;

  span {
    left: 95%;
    top: 3%;
    position: absolute;
  }

  span:hover {
    cursor: pointer;
    color: ${(p) => p.theme.navbar.title};
  }
`;

const ItemContainers = styled.div`
  margin: 15px 10px;

  ul {
    display: inline-flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    background: #101010;
    align-items: center;
    display: flex;
    margin-right: 5px;
    margin-bottom: 5px;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 13px;
  }

  button {
    align-items: center;
    font-size: 12px;
    height: 15px;
    width: 15px;
    margin-left: 5px;
    justify-content: 0;
    display: inline-flex;
    border: none;
    background: #030303;
    color: white;
    border-radius: 50%;
    padding-left: 4px;
    padding-bottom: 1px;
    font-family: 'Roboto';

    :hover {
      color: #e31919;
      cursor: pointer;
      font-family: 'Roboto';
    }
  }
`;

const InputTag = styled.div`
  display: flex;
  height: 23px;
  position: relative;
  padding-bottom: 10px;
  width: 100%;
  justify-content: center;

  input {
    padding-left: 10px;
    color: white;
    font-family: 'Roboto';
    width: 90%;
    height: 30px;
    background: ${(p) => p.theme.input.backCol};
    border-radius: 5px;
    border: 0;
    transition: 340ms;

    :focus {
      background: ${(p) => p.theme.input.activeCol};
      outline: 0;
      transition: 340ms;
    }
  }

  svg {
    position: absolute;
    left: 92%;
    float: right;
    margin-top: 10px;

    :hover {
      cursor: pointer;
      color: ${(p) => p.theme.navbar.titleHover};
    }
  }
`;

const DialogContainer = styled.div`
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
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const DialogBox = styled.div`
  position: fixed;
  width: 30%;
  min-height: 30%;
  background-color: #202225;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.div`
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
