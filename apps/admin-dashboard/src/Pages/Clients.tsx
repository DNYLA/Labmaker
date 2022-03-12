import styled from 'styled-components';
import {
  LogTable,
  DropDown,
  LoadingSpinner,
  Content,
  Page,
  UserControls,
  InputBox,
  SettingsContainer,
} from '@labmaker/ui';
import { useState } from 'react';
import { useFetchClients } from '../utils/hooks/useFetchClients';

export function ClientsPage() {
  const { clients, loading, error } = useFetchClients();

  const handleChange = () => {
    console.log('Gi');
  };

  const handleDelete = () => {
    console.log('Gi');
  };

  const handleCreate = () => {
    console.log('Gi');
  };
  const handleRefresh = () => {
    console.log('Gi');
  };
  const handleSave = () => {
    console.log('Gi');
  };

  return (
    <Page>
      <LoadingSpinner loading={loading} message={'Loading Logs'} />
      <Content>
        <ControlsContainer>
          <div className="dropDownContainer">
            <DropDown items={[]} onChange={handleChange} value={0} />
          </div>

          <UserControls
            onDelete={handleDelete}
            onRefresh={handleRefresh}
            onCreate={handleCreate}
            onSave={handleSave}
          />
        </ControlsContainer>
        <SettingsContainer>
          {/* <InfoTitle title={'Account'} header={true} /> */}
          <InputBox
            message="Client ID"
            value={'client_id'}
            disabled={true}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setConfig({ ...config, clientId: e.target.value })
            // }
          />
          <InputBox
            message="Token"
            value={'client_token'}
            disabled={true}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setConfig({ ...config, clientId: e.target.value })
            // }
          />
          <InputBox
            message="Username"
            value={''}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setConfig({ ...config, clientId: e.target.value })
            // }
          />
          <InputBox
            message="Description"
            value={''}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setConfig({ ...config, clientId: e.target.value })
            // }
          />
        </SettingsContainer>
      </Content>
    </Page>
  );
}

const ControlsContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;

  .dropDownContainer {
    max-width: 200px;
  }

  @media (max-width: 800px) {
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    & > div:not(:last-child) {
      margin-bottom: 15px;
    }
  }
`;
