import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface NavbarProps {
  title: string;
  items: LinkProp[];
  avatarUrl: string;
}

export interface LinkProp {
  name: string;
  to?: string;
}

export function Navbar({ title, items, avatarUrl }: NavbarProps) {
  return (
    <StyledNavbar>
      <StyledLink to="/">
        <Title>{title}</Title>
      </StyledLink>
      <ul>
        {items.map((item, i) => {
          return (
            <NavItem key={i}>
              <StyledLink
                className={(navData) => (navData.isActive ? 'active' : '')}
                to={item.to ? item.to : item.name}
              >
                <p>{item.name}</p>
              </StyledLink>
            </NavItem>
          );
        })}
      </ul>
      <IconStyle src={avatarUrl} alt="Avatar" />
    </StyledNavbar>
  );
}

export default Navbar;

const StyledNavbar = styled.nav`
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: ${(p) => p.theme.navbar.base};
  box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.2);

  ul {
    list-style-type: none;
  }
`;

const IconStyle = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;

  :hover {
    cursor: pointer;
  }
`;

const Title = styled.h1`
  font-family: 'Archivo Black', sans-serif;
  font-size: 30px;
  color: ${(p) => p.theme.navbar.title};
  width: 200px;
  transition: all 200ms ease-in-out;

  :hover {
    color: ${(p) => p.theme.navbar.titleHover};
  }
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;

  &.active {
    p {
      color: ${(p) => p.theme.navbar.active};
    }
  }

  p {
    font-size: 30px;
    margin: 0px;
    color: ${(p) => p.theme.navbar.item};
    transition: all 200ms ease-in-out;

    :hover {
      color: ${(p) => p.theme.navbar.active};
    }
  }
`;

const NavItem = styled.li`
  text-decoration: none;
  display: inline-block;
  padding-right: 50px;
`;
