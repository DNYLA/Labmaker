import { GuildConfigDto, PaymentDto } from '@labmaker/wrapper';
import styled from 'styled-components';
import { SettingsContainer } from '../../assets/styles';
import { PaymentBox } from './payment';
import { useGuildLogic } from '../../utils/hooks/useGuildLogic';
import { useNavigate } from 'react-router-dom';

/* eslint-disable-next-line */
export interface PaymentSettingsProps {
  // payments: any;
  // guilds: any;
  // config: GuildConfigDto;
  // setPayments: any;
  // createPayment: any;
}

export function PaymentSettings(props: PaymentSettingsProps) {
  const { guildConfig, payments, setPayments, createPayment } = useGuildLogic();
  const navigate = useNavigate();

  const renderPayments = (payments: PaymentDto[]) => {
    let delKey = -2;

    if (!guildConfig) {
      return <div></div>;
    }
    console.log(
      `Guild Config: ${guildConfig.id} || PaymentID: ${guildConfig.paymentConfigId}`
    );
    if (guildConfig.id === guildConfig.paymentConfigId) {
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
        <CenterDiv>
          <CustomButton
            onClick={() => navigate(`/discord/${guildConfig.paymentConfigId}`)}
          >
            Go to Payments Config
          </CustomButton>
        </CenterDiv>
      );
    }
  };

  if (!guildConfig) {
    return <div></div>;
  } else {
    return (
      <SettingsContainer>
        <h1>Payment</h1>

        {renderPayments(payments)}
        {guildConfig.id === guildConfig.paymentConfigId && (
          <CenterDiv>
            <CustomButton onClick={createPayment}>Add</CustomButton>
          </CenterDiv>
        )}
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
