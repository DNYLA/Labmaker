import { Selector } from '../components/Selector';
import { RedditConfigDto } from 'labmaker-api-wrapper';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { SelectorContainer } from '../styles/Styles';

type NodeListProps = {
  onClick: any;
};

export const NodeConfigList = ({ onClick }: NodeListProps) => {
  const user = useSelector((state: RootState) => state.user.value);

  return (
    <SelectorContainer>
      {user.nodes.map((node: RedditConfigDto) => {
        return (
          <Selector
            key={node.id}
            clickEvent={() => onClick(node)}
            message={node.username}
          />
        );
      })}
    </SelectorContainer>
  );
};
