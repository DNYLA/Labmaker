import styled from 'styled-components';

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({ children, onClick }: ButtonProps) {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
}

const StyledButton = styled.button`
  cursor: pointer;
  background-color: ${(p) => p.theme.input.backCol};
  color: #fff;
  font-size: 20px;
  font-family: 'Archivo Black', 'Roboto', sans-serif;
  width: 100%;
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  transition: background-color 100ms ease-in;

  &:hover {
    background-color: #1a1a1a;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`;
