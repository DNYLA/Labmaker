import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const Menu = () => {
  const user = useSelector((state: RootState) => state.user.value);

  return (
    <MenuStyle>
      <Link to="/">
        <MenuHeader>
          <IconStyle
            src={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
                : 'https://i.imgur.com/yrZKnwI.png'
            }
            alt="Reddit Avatar"
          />
        </MenuHeader>
      </Link>

      <MenuContent>
        <Link to="/">
          <MenuItem>
            <FontAwesomeIcon icon={faHome} size="2x" color="#FFF" />
          </MenuItem>
        </Link>
        <Link to="/discord">
          <MenuItem>
            <FontAwesomeIcon
              className="icon"
              icon={faDiscord}
              size="2x"
              color="#FFF"
            />
          </MenuItem>
        </Link>
        <Link to="/logs">
          <MenuItem>
            <FontAwesomeIcon icon={faInfoCircle} size="2x" color="#FFF" />
          </MenuItem>
        </Link>
      </MenuContent>
    </MenuStyle>
  );
};

const IconStyle = styled.img`
  height: 55px;
  width: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s all;
  border-radius: 50%;
`;

const MenuStyle = styled.div`
  width: 85px;
  height: 100%;
  background-color: ${(props) => props.theme.base.menu};
  position: fixed;
  box-sizing: border-box;
  @media (max-width: 812px) {
    position: unset;
    display: flex;
    flex-flow: row;
    flex-direction: row;
    width: 100%;
  }
`;

const MenuHeader = styled.header`
  box-sizing: border-box;
  box-shadow: 0px 1px 25px 0px rgba(0, 0, 0, 0.25);
  padding: 15px;
  background-color: inherit;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  height: ${(props) => props.theme.height.topContent};

  @media (max-width: 812px) {
    position: unset;
    display: flex;
    flex-flow: row;
  }
`;

const MenuContent = styled.div`
  box-sizing: border-box;
  #noLink {
  }
  a {
  }
  @media (max-width: 812px) {
    position: unset;
    display: flex;
    flex-flow: row;
  }
`;

const MenuItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  transition: 250ms all;
  :hover {
    background-color: ${(props) => props.theme.base.menuHover};
    cursor: pointer;
  }
  @media (max-width: 812px) {
    width: 50px;
    height: 45px;
    svg {
      padding-top: 10px;
    }
  }
`;
