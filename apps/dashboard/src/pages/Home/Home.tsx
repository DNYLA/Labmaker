import { useEffect, useState } from 'react';
import { BasePageStyle, CenterDiv, CustomButton } from '../../styles/Styles';
import { PageHeader } from '../../components/PageHeader';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateReddit } from '../../utils/slices/configSlices';
import { Labmaker } from '../../utils/APIHandler';
import { Spinner } from '../../components/Spinner';
import { updateUser } from '../../utils/slices/userSlice';
import { AccountSettings } from './AccountSettings';
import { MainSettings } from './MainSettings';
import { NodeConfigList } from '../../components/NodeConfigList';
import { Node } from '../../utils/types';
import { nodeTemplate } from '../../utils/LoadingTypes';
import { RedditConfigDto } from 'labmaker-api-wrapper';
import { DialogButton } from '../../components/DialogButton';

function useNodeLogic() {
  const dispatch = useDispatch();
  const [reload, setReload] = useState(true);
  const user = useSelector((state: RootState) => state.user.value);
  const redditConfig = useSelector(
    (state: RootState) => state.redditConfig.value
  );

  const handleClick = async (node: RedditConfigDto) => {
    if (node.id === redditConfig.id && node.id !== -1) {
      console.log('ended');
      return;
    }

    if (node.id === -1) {
      console.log('Creating New');
      //Create Node
      const newNode: Node = { ...nodeTemplate, id: 0 };
      dispatch(updateReddit({ ...newNode, id: 0, userId: user.id }));
    } else {
      const config: Node = node;

      if (!config) {
        console.log('Invalid Id/Error Occured?');
        return;
      }
      dispatch(updateReddit(config));
    }
  };

  useEffect(() => {
    const loadConfig = async () => {
      if (user.nodes.length === 0) {
        const nodes = [nodeTemplate];
        dispatch(updateUser({ ...user, nodes: nodes }));
        dispatch(updateReddit({ ...redditConfig, loading: false }));
        return;
      }

      const config: Node = user.nodes[0];
      const hasCreate = user.nodes.find((n) => n.id === -1);

      if (!hasCreate) {
        const nodes = [...user.nodes, nodeTemplate];
        dispatch(updateUser({ ...user, nodes: nodes }));
      } else {
        const nodes = [...user.nodes];
        nodes.push(nodes.splice(nodes.indexOf(hasCreate), 1)[0]); //Move Create Node to end of List
        dispatch(updateUser({ ...user, nodes }));
      }

      if (!config) return;
      dispatch(updateReddit(config));

      setReload(false);
    };
    if (reload) {
      loadConfig();
    }
  });

  const saveNode = async () => {
    if (!redditConfig.newNode) return Labmaker.Reddit.update(redditConfig);

    const newNode = await Labmaker.Reddit.create({
      ...redditConfig,
      userId: user.id,
    });

    if (newNode) {
      dispatch(updateReddit(newNode));
      dispatch(updateUser({ ...user, nodes: [...user.nodes, newNode] }));
      setReload(true);
    }

    return;
  };

  //Fix Reload
  const deleteNode = async () => {
    // if (redditConfig.id === '3630aeb2-38c5-4c36-a0d5-5c2d95fa35b0') return;

    await Labmaker.Reddit.deleteConfig(redditConfig.id);
    const nodes = [...user.nodes];
    const index = nodes.indexOf(redditConfig);

    if (index > -1) {
      nodes.splice(index, 1);
      dispatch(updateUser({ ...user, nodes }));
      setReload(true);
    }
  };

  return { redditConfig, handleClick, saveNode, deleteNode, user };
}

export const Home = () => {
  const { redditConfig, handleClick, saveNode, deleteNode } = useNodeLogic();

  const renderSettings = () => {
    if (redditConfig.id === -1) {
      // return <SelectorContainer>Create a Config Above</SelectorContainer>;
      return <div></div>;
    } else {
      return (
        <div>
          <ComboContainer>
            <AccountSettings config={redditConfig} />
            <MainSettings config={redditConfig} />
          </ComboContainer>
          <ButtonContainer>
            <CenterDiv>
              <CustomButton onClick={saveNode}>Save</CustomButton>
            </CenterDiv>
          </ButtonContainer>
        </div>
      );
    }
  };

  return (
    <HomeStyle>
      <Spinner
        loading={redditConfig.loading}
        message={'Loading Reddit Config'}
      />
      <PageHeader
        title="LabMaker Reddit Settings"
        subtitle={`/u/${redditConfig.username}`}
      />

      <BasePageStyle>
        <NodeConfigList onClick={handleClick} />
        <DialogButton onClick={deleteNode} deleteName={redditConfig.username} />
        {renderSettings()}
      </BasePageStyle>
    </HomeStyle>
  );
};

export default Home;

const HomeStyle = styled.div`
  transition: all 5s ease-in-out;
`;

const ButtonContainer = styled.div`
  /* padding: 25px; */
  padding-top: 15px;

  button {
    margin-left: 35px;
  }
`;

const ComboContainer = styled.div`
  display: flex;
  margin-left: 5px;

  #comboContainer {
    margin-left: 15px;
  }

  @media (max-width: 812px) {
    display: inline;
  }
`;
