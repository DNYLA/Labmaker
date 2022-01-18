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
}

export function TextArea({
  message,
  infoMessage,
  value,
  onChange,
  disabled,
}: TextAreaProps) {
  return (
    <StyledTextArea>
      <InfoTitle title={message} infoMessage={infoMessage} />
      <TextareaContainer>
        <span>{value.length} / 300</span>
        <StyledTextarea
          value={value}
          onChange={(e) => onChange(e)}
          disabled={disabled}
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
  background: ${(p) => p.theme.input.backCol};
  border: 2px solid ${(p) => p.theme.input.borderCol};
  border-radius: 5px;
  transition: 340ms;

  min-width: 90%;
  :focus {
    opacity: 80%;
    outline: 0;
  }

  :disabled {
    color: gray;
    user-select: none;
    pointer-events: none;
  }

  transition: 150ms;
`;
