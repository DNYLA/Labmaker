import { PaymentDto } from 'labmaker-api-wrapper';
import { Payment } from './Payment';
import { GuildConfig } from '../../utils/types';
import {
  CenterDiv,
  CustomButton,
  GeneralSettingContainer,
} from '../../styles/Styles';

type PaymentSettingProp = {
  payments: any;
  guilds: any;
  config: GuildConfig;
  setPayments: any;
  createPayment: any;
};

export const PaymentSettings = ({
  payments,
  guilds,
  config,
  setPayments,
  createPayment,
}: PaymentSettingProp) => {
  const renderPayments = (payments: PaymentDto[]) => {
    let delKey = -2;
    if (guilds.length === 0) {
      return <div></div>;
    }
    if (config.id === config.paymentConfigId) {
      return payments.map((payment: PaymentDto, index) => {
        if (!payment.deletedPayment) {
          return (
            <Payment
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
        <p>
          To edit payments go to the correct server settings or change the
          payment config to use your own payments.
        </p>
      );
    }
  };

  if (guilds.length === 0) {
    return <div></div>;
  } else {
    return (
      <GeneralSettingContainer id="comboContainer">
        <h1>Payment</h1>
        <div>{renderPayments(payments)}</div>

        <CenterDiv>
          <CustomButton onClick={createPayment}>Add</CustomButton>
        </CenterDiv>
      </GeneralSettingContainer>
    );
  }
};
