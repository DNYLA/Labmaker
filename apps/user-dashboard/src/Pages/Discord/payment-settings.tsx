import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PaymentSettingsProps {}

const StyledPaymentSettings = styled.div`
  color: pink;
`;

export function PaymentSettings(props: PaymentSettingsProps) {
  return (
    <StyledPaymentSettings>
      <h1>Welcome to PaymentSettings!</h1>
    </StyledPaymentSettings>
  );
}

export default PaymentSettings;
