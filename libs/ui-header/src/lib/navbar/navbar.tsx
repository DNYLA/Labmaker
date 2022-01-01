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
      <StyledLink exact={true} to="/">
        <Title>{title}</Title>
      </StyledLink>
      <ul>
        {items.map((item) => {
          return (
            <NavItem>
              <StyledLink
                exact={true}
                activeClassName="active"
                to={item.to ? item.to : item.name}
              >
                <p>{item.name}</p>
              </StyledLink>
            </NavItem>
          );
        })}
      </ul>
      <a href="">
        <IconStyle src={avatarUrl} alt="Avatar" />
      </a>
    </StyledNavbar>
  );
}

export default Navbar;

const IconStyle = styled.img`
  height: 55px;
  width: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s all;
  border-radius: 50%;
`;

const StyledNavbar = styled.nav`
  /* width: 100%; */
  height: 70px;
  display: flex;
  justify-content: space-between;
  background-color: ${(p) => p.theme.navbar.base};
  ul {
    list-style-type: none;
    padding: 0;
    /* margin: 0; */
    margin-right: 100px;
  }
  /* align-items: center; */
`;

const Title = styled.h1`
  font-family: 'Archivo Black', sans-serif;
  font-size: 30px;
  margin-top: 0px;
  margin-left: 20px;
  line-height: 70px;
  color: ${(p) => p.theme.navbar.title};
  width: 200px;
  :hover {
    color: ${(p) => p.theme.navbar.titleHover};
    font-size: 40px;
    /* transition: font-size 600ms; */
  }
  transition: all 300ms ease-in-out;
`;

const StyledLink = styled(NavLink)`
  &.${(p) => p.activeClassName} {
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
    &.${(p) => p.activeClassName} {
      color: pink;
    }
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
