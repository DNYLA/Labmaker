import styled from 'styled-components';
import { PaymentBox } from './payment';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';
import { useNavigate } from 'react-router-dom';
import { Button, InfoTitle, SettingsContainer } from '@labmaker/ui';
import { Payment } from '@labmaker/shared';

/* eslint-disable-next-line */
export interface PaymentSettingsProps {
  // payments: any;
  // guilds: any;
  // config: configDto;
  // setPayments: any;
  // createPayment: any;
}

export function PaymentSettings(props: PaymentSettingsProps) {
  const { config, payments, setPayments, createPayment } = useGuildLogic();
  const navigate = useNavigate();

  const renderPayments = (payments: Payment[]) => {
    let delKey = -2;

    if (!config) {
      return <div></div>;
    }

    console.log(
      `Guild Config: ${config.id} || PaymentID: ${config.paymentConfigId}`
    );

    if (config.id === config.paymentConfigId) {
      return payments.map((payment: Payment, index) => {
        if (!payment.deletedPayment) {
          return (
            <PaymentBox
              payment={payment}
              setPayment={setPayments}
              payments={payments}
              key={index}
            />
          );
        } else {
          delKey--;
          return <div key={delKey}></div>;
        }
      });
    } else {
      return (
        <CenterDiv>
          <Button
            onClick={() => navigate(`/discord/${config.paymentConfigId}`)}
          >
            Go to Payments Config
          </Button>
        </CenterDiv>
      );
    }
  };

  if (!config) {
    return <div></div>;
  } else {
    return (
      <SettingsContainer>
        <InfoTitle title={'Payment'} header={true} />

        <PaymentsContainer>{renderPayments(payments)}</PaymentsContainer>

        {config.id === config.paymentConfigId && (
          <Button onClick={createPayment}>Create New</Button>
        )}
      </SettingsContainer>
    );
  }
}

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const PaymentsContainer = styled.div`
  max-height: 50vh;
  overflow-y: auto;

  & > *:not(:last-child) {
    margin-bottom: 15px;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
    margin-left: 50px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 50px;
    background: ${(p) => p.theme.input.backCol};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: ${(p) => p.theme.input.activeCol};
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #eee;
  }

  @media (max-width: 800px) {
    max-height: unset;
  }
`;
