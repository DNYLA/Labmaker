import { PaymentDto } from '@labmaker/wrapper';
import { GuildConfig } from '../../utils/types';
import styled from 'styled-components';
import { SettingsContainer } from '../../assets/styles';
import { PaymentBox } from './payment';

/* eslint-disable-next-line */
export interface PaymentSettingsProps {
  payments: any;
  guilds: any;
  config: GuildConfig;
  setPayments: any;
  createPayment: any;
}

export function PaymentSettings({
  payments,
  guilds,
  config,
  setPayments,
  createPayment,
}: PaymentSettingsProps) {
  const renderPayments = (payments: PaymentDto[]) => {
    let delKey = -2;

    if (guilds.length === 0) {
      return <div></div>;
    }

    if (config.id === config.paymentConfigId) {
      return payments.map((payment: PaymentDto, index) => {
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
        <p style={{ textAlign: 'center' }}>
          Currently you have no payment options. You can add your first one with
          the button below.
        </p>
      );
    }
  };

  if (guilds.length === 0) {
    return <div></div>;
  } else {
    return (
      <SettingsContainer>
        <h1>Payment</h1>

        {renderPayments(payments)}

        <CenterDiv>
          <CustomButton onClick={createPayment}>Add</CustomButton>
        </CenterDiv>
      </SettingsContainer>
    );
  }
}

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  button {
    margin-right: 25px;
  }
`;

const CustomButton = styled.button`
  width: 50%;
  height: 28px;
  border: none;
  background-color: #313c4b;
  border-radius: 5px;
  justify-content: center;
  color: white;
  font-family: 'Roboto';
  font-size: 18px;
  outline: none;
  transition: 0.5s;

  :active {
    border: none;
  }

  :hover {
    background-color: #455366;
    transition: 0.5s;
    cursor: pointer;
  }
`;
