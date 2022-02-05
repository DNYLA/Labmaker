import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ModalPopup, MultiModalWrapper, Page } from '@labmaker/ui';
import { TutorApplication } from '@labmaker/shared';
import { getApplications } from '@labmaker/wrapper';
import { useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface TutorApplicationsProps {
  design: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TutorApplications({
  design,
  open,
  setOpen,
}: TutorApplicationsProps) {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const { id } = useParams();

  console.log('TUTOR APPLICATIONS');

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

  return (
    <div>
      <StyledSpan onClick={() => setOpen(true)}>{design}</StyledSpan>

      {applications.length > 0 && (
        <MultiModalWrapper open={open} setOpen={setOpen}>
          {applications.map((app) => {
            return (
              //Covert to Modal OnClick Which allows you to accept or Decline
              <ModalPopup title={app.userId} key={app.id}>
                <p>User ID: {app.userId}</p>
                <p>Message: {app.applicationMessage}</p>
                <p>Vouches: {app.vouchesLink}</p>
                <p>Reddit: {app.redditUsername}</p>
                <p>Subejcts: {app.subjects.toString()}</p>
                <p>Created: {app.createdAt}</p>
              </ModalPopup>
            );
          })}
        </MultiModalWrapper>
      )}
    </div>
  );
}

const StyledSpan = styled.span`
  :hover {
    color: ${(p) => p.theme.navbar.title};
    cursor: pointer;
  }
`;
