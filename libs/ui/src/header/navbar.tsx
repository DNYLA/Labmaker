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
  font-size: 30px;

  &.active {
    p {
      color: ${(p) => p.theme.navbar.active};
    }
  }

  p {
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

const StyledNavbar = styled.nav`
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 25px;
  background-color: ${(p) => p.theme.navbar.base};
  box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.2);

  ul {
    display: flex;
    flex-flow: row;
    list-style-type: none;

    @media (min-width: 1000px) {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100%;
      left: 0;
    }
  }

  @media (max-width: 800px) {
    ${Title} {
      display: none;
    }

    ${IconStyle} {
      margin-left: auto;
    }
  }

  @media (max-width: 600px) {
    ${StyledLink} {
      font-size: 25px;
    }
  }

  @media (max-width: 500px) {
    ${StyledLink} {
      font-size: 20px;
    }

    ${NavItem} {
      padding-right: 25px;
    }
  }
`;
