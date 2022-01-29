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
  onChange?: IOnTextAreaChange;
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
  let handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e);
  };

  if (textLimit) {
    handleChange = (e) => {
      if (e.target.value.length > textLimit) return;
      if (onChange) onChange(e);
    };
  }

  return (
    <StyledTextAreaContainer>
      <InfoTitle title={message} infoMessage={infoMessage} />

      <TextAreaWrapper>
        {textLimit && (
          <StyledTextAreaLimit>
            {value.length} / {textLimit}
          </StyledTextAreaLimit>
        )}

        <StyledTextArea
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      </TextAreaWrapper>
    </StyledTextAreaContainer>
  );
}

const StyledTextAreaContainer = styled.div`
  user-select: none;
`;

const TextAreaWrapper = styled.div`
  display: flex;
  position: relative;
`;

const StyledTextAreaLimit = styled.span`
  pointer-events: none;
  position: absolute;
  bottom: 5px;
  right: 8px;
  font-size: 10px;
  text-shadow: 1px 1px 0px #000;
`;

const StyledTextArea = styled.textarea`
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
  min-height: 80px;
  resize: vertical; // Only allow vertical resize

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
