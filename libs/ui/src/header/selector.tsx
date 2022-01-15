import styled from 'styled-components';
import { DisableDrag } from '../styles';

/* eslint-disable-next-line */
export interface SelectorProps {
  title?: string;
  clickEvent: () => void;
  imageUrl?: string;
  isActive?: boolean;
}

export function Selector({
  title,
  clickEvent,
  imageUrl,
  isActive,
}: SelectorProps) {
  if (!imageUrl) {
    imageUrl = `https://avatars.dicebear.com/api/micah/${title}.svg`;
  }

  return (
    <StyledSelector className={isActive ? 'active' : ''} onClick={clickEvent}>
      <img src={imageUrl} alt="Node Avatar" />
      <span title={title}>{title}</span>
    </StyledSelector>
  );
}

const StyledSelector = styled(DisableDrag)`
  min-width: 60px;
  max-width: 60px;
  margin-bottom: 30px;
  cursor: pointer;

  img {
    user-select: none;
    width: 100%;
    height: auto;
    border-radius: 50%;
    transition: border-radius 150ms ease-in-out;
  }

  span {
    display: -webkit-box;
    max-height: 30px;
    width: 100%;
    margin-top: 3px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
  }

  &.active {
    img {
      border-radius: 30%;
    }
  }

  &:hover {
    img {
      border-radius: 30%;
    }
  }
`;
