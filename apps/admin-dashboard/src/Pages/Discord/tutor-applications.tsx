import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, ComboContainer, InfoTitle, ModalPopup } from '@labmaker/ui';
import { TutorApplication } from '@labmaker/shared';
import { getApplications, reviewApplication } from '@labmaker/wrapper';
import { useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface TutorApplicationsProps {}

export function TutorApplications() {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [modalShown, setModalShown] = useState(false);
  const [activeApp, setActiveApp] = useState<TutorApplication>(); // Active application for modal
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    if (!id) return;
    getApplications(id)
      .then(({ data }) => {
        setApplications(data);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }, [id]);

  const renderTutorApps = () => {
    if (applications.length > 0) {
      return (
        <StyledTutorAppsContainer>
          {applications.map((app) => {
            return (
              <StyledTutorApp
                key={app.id}
                onClick={() => {
                  setActiveApp(app);
                  setModalShown(true);
                }}
              >
                <p>
                  <b>User ID:</b> {app.userId}
                </p>
                <p>
                  <b>Message:</b> {app.applicationMessage}
                </p>
                <p>
                  <b>Vouches:</b> {app.vouchesLink}
                </p>
                <p>
                  <b>Reddit:</b> {app.redditUsername}
                </p>
                <p>
                  <b>Subejcts:</b> {app.subjects.join(', ')}
                </p>
                <p>
                  <b>Created:</b> {app.createdAt}
                </p>
              </StyledTutorApp>
            );
          })}
        </StyledTutorAppsContainer>
      );
    }

    // todo: center this
    return <div>No Tutor Applications</div>;
  };

  const proceedApplication = () => {
    console.log('opk', activeApp);
    const app = activeApp;

    if (app) {
      reviewApplication(activeApp?.id, 'INTERVIEW');
    }
  };

  return (
    <StyledTutorAppsPage>
      <InfoTitle title={'Tutor Applications'} header={true} />

      {renderTutorApps()}

      {activeApp && (
        <ModalPopup
          title={activeApp.userId}
          open={modalShown}
          setOpen={setModalShown}
        >
          <p>User ID: {activeApp.userId}</p>
          <p>Message: {activeApp.applicationMessage}</p>
          <p>Vouches: {activeApp.vouchesLink}</p>
          <p>Reddit: {activeApp.redditUsername}</p>
          <p>Subejcts: {activeApp.subjects.join(', ')}</p>
          <p>Created: {activeApp.createdAt}</p>

          <ComboContainer>
            <Button onClick={() => proceedApplication()}>Interview</Button>
            <Button>Deny</Button>
          </ComboContainer>
        </ModalPopup>
      )}
    </StyledTutorAppsPage>
  );
}

const StyledTutorAppsPage = styled.div`
  & > * {
    margin-bottom: 15px;
  }
`;

const StyledTutorAppsContainer = styled.div`
  display: flex;
  flex-flow: row;
  overflow-x: auto;
  padding-bottom: 5px;
  border-radius: 5px;
`;

const StyledTutorApp = styled.div`
  padding: 10px 15px;
  max-width: 350px;
  border-radius: 5px;
  background-color: ${(p) => p.theme.input.backCol};
  font-family: 'Roboto';
  cursor: pointer;
  transition: background-color 100ms ease-in;

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: ${(p) => p.theme.input.activeCol};
  }

  & > * {
    margin-bottom: 1px;
  }

  &:not(:last-child) {
    margin-right: 15px;
  }
`;
