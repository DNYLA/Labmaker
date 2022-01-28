import { Payment } from '@labmaker/shared';
import { InputBox } from '@labmaker/ui';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PaymentProps {
  payment: Payment;
  payments: Payment[];
  setPayment: (payments: Payment[]) => void;
}

enum InputType {
  Name,
  Value,
  Type,
}

export function PaymentBox({ payment, payments, setPayment }: PaymentProps) {
  const updatePayments = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputType: InputType
  ) => {
    const details = {
      name: payment.name,
      value: payment.value,
      type: payment.type,
    };

    switch (inputType) {
      case InputType.Name: {
        details.name = e.target.value;
        break;
      }
      case InputType.Value: {
        details.value = e.target.value;
        break;
      }
      case InputType.Type: {
        details.type = e.target.value;
        break;
      }
    }

    const _payments = [...payments];
    const index = _payments.findIndex((x) => x.id === payment.id);

    if (index > -1) {
      _payments[index] = {
        ...payment,
        name: details.name,
        value: details.value,
        type: details.type,
      };
      setPayment(_payments);
    }
  };

  const deletePayment = () => {
    const _payments = [...payments];
    const index = _payments.findIndex((x) => x.id === payment.id);

    if (index > -1) {
      _payments[index] = {
        ...payment,
        deletedPayment: true,
      };
      setPayment(_payments);
    }
  };

  return (
    <StyledPayment>
      <InputBox
        message="Name"
        value={payment.name}
        onChange={(e) => updatePayments(e, InputType.Name)}
      />

      <InputBox
        message="Value"
        value={payment.value}
        onChange={(e) => updatePayments(e, InputType.Value)}
      />

      <InputBox
        message="Type"
        value={payment.type}
        onChange={(e) => updatePayments(e, InputType.Type)}
      />

      <button onClick={deletePayment}>X</button>
    </StyledPayment>
  );
}

const StyledPayment = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  padding-right: 30px;

  div {
    margin-right: 5px;
  }

  button {
    position: absolute;
    color: white;
    border: none;
    border-radius: 15%;
    background-color: #8d121c;
    height: 30px;
    width: 30px;
    bottom: 0px;
    right: 0px;
    transition: all 0.6s ease-in-out;

    &:hover {
      cursor: pointer;
      background-color: #e32132;
      transition: all 0.3s ease-in-out;
    }
  }
`;
