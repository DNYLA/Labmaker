import { InfoTitle } from './info-box';
import styled from 'styled-components';

export interface IOnTextAreaChange {
  (event: React.ChangeEvent<HTMLTextAreaElement>): void;
}
/* eslint-disable-next-line */
export interface TextAreaProps {
  value: string | string[];
  infoMessage?: string | React.ReactNode;
  message: string;
  onChange: IOnTextAreaChange;
  disabled?: boolean;
  textLimit?: number;
  placeholder?: string;
}

export function TextArea({
  message,
  infoMessage,
  value,
  onChange,
  disabled,
  textLimit,
  placeholder,
}: TextAreaProps) {
  let handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e);

  if (textLimit) {
    handleChange = (e) => {
      if (e.target.value.length > textLimit) return;
      onChange(e);
    };
  }

  return (
    <StyledTextArea>
      <InfoTitle title={message} infoMessage={infoMessage} />
      <TextareaContainer>
        {textLimit && (
          <span>
            {value.length} / {textLimit}
          </span>
        )}

        <StyledTextarea
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      </TextareaContainer>
    </StyledTextArea>
  );
}

const StyledTextArea = styled.div`
  user-select: none;
`;

const TextareaContainer = styled.div`
  display: flex;
  /* position: relative; */
  span {
    position: absolute;
    font-size: 10px;
    width: 100px;
    left: 90%;
    top: 50%;
  }
`;

const StyledTextarea = styled.textarea`
  display: flex;
  padding: 5px 10px;
  color: white;
  font-family: 'Roboto';
  width: 100%;
  height: 100px;
  margin-top: 5px;
  background-color: ${(p) => p.theme.input.backCol};
  border: 0;
  border-radius: 5px;
  transition: background-color 250ms ease-in-out;
  min-width: 90%;

  :focus {
    background-color: ${(p) => p.theme.input.activeCol};
    outline: 0;
  }

  :disabled {
    color: gray;
    user-select: none;
    pointer-events: none;
  }
`;
