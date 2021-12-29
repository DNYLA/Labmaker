import styled, { css } from 'styled-components';

type RadioProps = {
  square?: boolean;
  toggled: boolean;
  onToggle: any;
  message?: String;
};

export const Switch = ({ message, toggled, onToggle, square }: RadioProps) => {
  return (
    <>
      <StyledSpan>{message}</StyledSpan>
      <SwitchStyle>
        <input type="checkbox" checked={toggled} onChange={onToggle} />
        <Slider rounded={square} checked={toggled} onChange={onToggle} />
      </SwitchStyle>
    </>
  );
};

const StyledSpan = styled.span`
  padding-right: 5px;
`;

const SwitchStyle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 23px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  input:checked + span:before {
    transform: translatex(26px);
  }
  input:checked + span {
    background-color: #2196f3;
  }
`;

const Slider = styled.span<any>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.4s;
  background-color: #ccc;
  ${(props) =>
    props.isSquare
      ? css`
          border-radius: 0px;
        `
      : css`
          border-radius: 34px;
        `}
  :before {
    position: absolute;
    content: '';
    height: 15px;
    width: 15px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    ${(props) =>
      props.isSquare
        ? css`
            border-radius: 0px;
          `
        : css`
            border-radius: 50%;
          `}
  }
`;
