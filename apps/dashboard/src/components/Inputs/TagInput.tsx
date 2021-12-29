import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled from 'styled-components';

type TagInputProps = {
  message: string;
  items: string[];
  onChange: Function;
  type?: string;
};

export const TagInputBox = ({ message, onChange, items }: TagInputProps) => {
  const [isHidden, setIsHidden] = useState(true);

  const handleKeyDown = (event: any) => {
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

  if (isHidden) {
    return (
      <div>
        <ButtonIcon onClick={() => setIsHidden(!isHidden)}>
          <FontAwesomeIcon icon={faCaretRight} /> {message}
        </ButtonIcon>
      </div>
    );
  } else {
    return (
      <div className="inputBox">
        <ButtonIcon onClick={() => setIsHidden(!isHidden)}>
          <FontAwesomeIcon icon={faCaretDown} /> {message}
        </ButtonIcon>

        <InputTag>
          <ul className="tags">
            {items.map((tag, i) => {
              return (
                <li className="tags-li">
                  {tag} <button onClick={() => removeTag(i)}> x </button>
                </li>
              );
            })}
          </ul>
          <input type="text" onKeyDown={handleKeyDown} />
        </InputTag>
      </div>
    );
  }
};

const ButtonIcon = styled.div`
  width: 100%;
  background-color: #202225;
  box-sizing: border-box;
  margin-bottom: 15px;
  @media (max-width: 812px) {
    position: unset;
    display: flex;
    flex-flow: row;
    flex-direction: row;
    width: 100%;
  }
  :hover {
    cursor: pointer;
  }
`;

const InputTag = styled.div`
  display: flex;
  background: #141617;
  border: 2px solid #1f1f1f;
  border-radius: 5px;
  padding: 5px 5px 0px;
  transition: all 1s;

  span {
    padding-right: 5px;
  }

  ul {
    display: inline-flex;
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
    font-family: 'Lexend Deca';
    :hover {
      color: #e31919;
      cursor: pointer;
      font-family: 'Lexend Deca';
    }
  }

  input {
    align-items: center;
    justify-content: center;
    border: 2px solid #101010;
    color: white;
    font-family: 'Lexend Deca';
    width: 100%;
    height: 30px;
    background: #141617;
    border-radius: 5px;
    transition: 340ms;
    :focus {
      background: #1f1f1f;
      border: 2px solid #292929;
      outline: 0;
      transition: 340ms;
    }
  }
`;
