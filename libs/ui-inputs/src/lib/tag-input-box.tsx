import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface TagInputBoxProps {
  title: string;
}

const StyledTagInputBox = styled.div`
  color: #eee;
  /* padding-bottom: 10px; */
  margin-bottom: 15px;
`;
//Currently Broken Fix CSS
export function TagInputBox({ title }: TagInputBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    'name1',
    'name2',
    'name1',
    'name2',
    'name1',
    'name2',
    'name1',
    'name2',
    'name1',
    'name2',
    'name1',
    'name2',
  ];

  const removeTag = (index: number) => {
    const tagsArray = [...items];

    tagsArray.splice(index, 1);
    // onChange(tagsArray);
  };

  return (
    <StyledTagInputBox>
      <StyledSpan onClick={() => setIsOpen(true)}>{title}</StyledSpan>
      {isOpen && (
        <DialogContainer>
          <Background />
          <DialogBox>
            <TitleContainer>
              <h1>{title}</h1>
              <span onClick={() => setIsOpen(false)}>X</span>
            </TitleContainer>
            <InputTag>
              <input
                type="text"
                value={'Enter a Subreddit'}
                onKeyDown={() => {}}
              />
              <span>
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </InputTag>
            <ItemContainers>
              <ul className="tags">
                {items.map((tag, i) => {
                  return (
                    <li className="tags-li">
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

const StyledSpan = styled.span`
  :hover {
    color: ${(p) => p.theme.navbar.title};
    cursor: pointer;
  }
  margin-bottom: 15px;
`;

const TitleContainer = styled.span`
  display: flex;
  align-items: center;
  span {
    left: 90%;
    position: relative;
  }

  span:hover {
    cursor: pointer;
    color: ${(p) => p.theme.navbar.title};
  }
`;

const ItemContainers = styled.span`
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
`;

const InputTag = styled.div`
  display: flex;
  height: 23px;
  position: relative;
  padding-bottom: 10px;
  margin-top: 3px;
  input {
    padding-left: 10px;
    color: gray;
    font-family: 'Lexend Deca';
    width: 90%;
    height: 30px;
    background: ${(p) => p.theme.input.backCol};
    border-radius: 5px;
    border: 2px solid ${(p) => p.theme.input.borderCol};
    /* border-radius: 5px; */
    transition: 340ms;
    :focus {
      opacity: 80%;
      outline: 0;
      transition: 340ms;
    }
  }

  span {
    position: absolute;
    left: 85%;
    margin-top: 8px;
    :hover {
      cursor: pointer;
    }
  }
`;

const DialogContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  position: fixed;
  align-items: center;
  z-index: 1002;
`;

const DialogBox = styled.div`
  /* z-index: 1001; */
  position: fixed;
  width: 30%;
  height: 30%;
  background-color: #202225;
  /* top: 35%; */
  /* left: 35%; */
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;
