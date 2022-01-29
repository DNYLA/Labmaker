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
  margin-top: 10px;
  background-color: ${(p) => p.theme.input.backCol};
  color: #fff;
  font-size: 20px;
  font-family: 'Archivo Black', 'Roboto', sans-serif;
  width: fit-content;
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  transition: background-color 100ms ease-in;

  &:hover {
    background-color: #1a1a1a;
  }
`;
