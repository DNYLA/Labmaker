import styled, { css } from 'styled-components';

/* eslint-disable-next-line */
export interface SwitchProps {
  square?: boolean;
  toggled: boolean;
  onToggle: any;
  message?: String;
}

const StyledSwitch = styled.div`
  margin: 2px 0px;
`;

//If you use a switch add it to the bottom of the Container its inside as it looks better
export function SwitchToggle({
  square,
  toggled,
  onToggle,
  message,
}: SwitchProps) {
  return (
    <StyledSwitch>
      <StyledSpan>{message}</StyledSpan>
      <SwitchStyle>
        <input type="checkbox" checked={toggled} onChange={onToggle} />
        <Slider rounded={square} checked={toggled} onChange={onToggle} />
      </SwitchStyle>
    </StyledSwitch>
  );
}

const StyledSpan = styled.span`
  padding-right: 5px;
`;

const SwitchStyle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 23px;
  margin-left: 10px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  input:checked + span:before {
    transform: translatex(26px);
  }
  input:checked + span {
    //Enable this if you want background colour to change when checked
    /* background-color: ${(p) => p.theme.navbar.title}; */
  }
`;

const Slider = styled.span<any>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 1.5px;
  bottom: 0;
  transition: 0.4s;
  background-color: ${(p) => p.theme.input.backCol};
  ${(props) =>
    props.isSquare
      ? css`
          border-radius: 0px;
        `
      : css`
          border-radius: 17px;
        `}
  :before {
    position: absolute;
    content: '';
    height: 19px;
    width: 19px;
    left: 1.5px;
    bottom: 2px;
    background-color: ${({ theme, checked }) =>
      //This works but i cant wrap my head around why
      // checked
      //   ? theme.input.switchActive
      //   : theme.input.SwitchActive
      //   ? theme.navbar.title
      //   : '#EEE'};
      !checked
        ? theme.text
        : theme.input.SwitchActive
        ? theme.input.SwitchActive
        : theme.navbar
            .title}; //If Checked then back-col = SwitchActive if its defined Else default to Title Color (Best to stick with title but you can override)
    transition: 0.4s;
    ${(props) =>
      props.isSquare
        ? css`
            border-radius: 0px;
          `
        : css`
            border-radius: 17px;
          `}
  }
`;
