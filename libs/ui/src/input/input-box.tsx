import { InfoTitle } from './info-box';
import styled from 'styled-components';

export interface IOnInputBoxChange {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}
/* eslint-disable-next-line */
export interface InputBoxProps {
  value: string | string[] | number;
  infoMessage?: string | React.ReactNode;
  message: string;
  onChange?: IOnInputBoxChange;
  disabled?: boolean;
  type?: 'text' | 'number'; // Only allow type text or number on this input
  prefix?: string;
}

export function InputBox({
  message,
  infoMessage,
  value,
  onChange,
  disabled,
  type,
  prefix,
}: InputBoxProps) {
  return (
    <StyledInputBox>
      <InfoTitle title={message} infoMessage={infoMessage} />

      <StyledInputWrapper>
        <StyledInput
          value={value}
          onChange={(e) => { if (onChange) onChange(e)}}
          disabled={disabled}
          type={type}
          className={prefix ? 'has-prefix' : ''}
          min="0"
        />

        <span className="prefix">{prefix}</span>
      </StyledInputWrapper>
    </StyledInputBox>
  );
}

const StyledInputBox = styled.div`
  user-select: none;
`;

const StyledInputWrapper = styled.div`
  position: relative;

  & .prefix {
    position: absolute;
    top: 5px;
    left: 10px;
  }
`;

const StyledInput = styled.input`
  display: flex;
  position: relative;
  padding: 0 10px;
  color: white;
  font-family: 'Roboto';
  width: 100%;
  height: 30px;
  margin-top: 5px;
  background: ${(p) => p.theme.input.backCol};
  border: 0;
  border-radius: 5px;
  transition: 250ms;

  :focus {
    background: ${(p) => p.theme.input.activeCol};
    outline: 0;
  }

  :disabled {
    color: gray;
    user-select: none;
    pointer-events: none;
  }

  &.has-prefix {
    padding-left: 30px;
  }

  // Hide increment buttons on number input type.
  // We are only really using the number type so users cant type letters.
  appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;
