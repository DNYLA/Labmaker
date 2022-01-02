import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PaymentProps {}

const StyledPayment = styled.div`
  color: pink;
`;

export function Payment(props: PaymentProps) {
  return (
    <StyledPayment>
      <h1>Welcome to Payment!</h1>
    </StyledPayment>
  );
}

export default Payment;
