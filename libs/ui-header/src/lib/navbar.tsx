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

const IconStyle = styled.img`
  height: 55px;
  width: 55px;
  margin-right: 15px;
  transition: 0.2s all;
  border-radius: 50%;
  :hover {
    cursor: pointer;
  }
`;

const StyledNavbar = styled.nav`
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(p) => p.theme.navbar.base};
  box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.2);
  /* border-bottom: 2px solid #1a1a1d; */
  ul {
    list-style-type: none;
  }
`;

const Title = styled.h1`
  font-family: 'Archivo Black', sans-serif;
  font-size: 30px;
  margin-left: 20px;
  color: ${(p) => p.theme.navbar.title};
  width: 200px;
  :hover {
    color: ${(p) => p.theme.navbar.titleHover};
    font-size: 40px;
  }
  transition: all 300ms ease-in-out;
`;

const StyledLink = styled(NavLink)`
  &.active {
    p {
      color: ${(p) => p.theme.navbar.active};
    }
  }
  text-decoration: none;

  h1 {
  }

  p {
    font-size: 30px;
    margin: 0px;
    color: ${(p) => p.theme.navbar.item};
    :hover {
      color: ${(p) => p.theme.navbar.active};
    }
    transition: all 250ms ease-in;
  }
`;

const NavItem = styled.li`
  text-decoration: none;

  display: inline-block;
  padding-right: 50px;
`;
