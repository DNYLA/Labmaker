import {
  Button,
  ButtonContainer,
  InputBox,
  InputDate,
  InputTime,
  ModalPopup,
  SwitchToggle,
  TextArea,
} from '@labmaker/ui';
import { Ticket, TicketAction } from '@labmaker/shared';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ConvertType,
  ConvertEdu,
  ConvertSbj,
  getServerId,
} from '../../utils/helpers';
import { deleteTicket, updateTicket } from '@labmaker/wrapper';
import { toast } from 'react-toastify';

interface TicketContainerProps {
  subject: string;
  type: string;
  budget: number;
  due: Date;
  onClick?: (e: any) => void;
}

interface TicketModalProps {
  ticket: Ticket;
  student: boolean;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TicketContainer({
  subject,
  type,
  budget,
  due,
  onClick,
}: TicketContainerProps) {
  return (
    <TicketContainerStyle onClick={onClick}>
      <h4>
        {subject} - {type}
      </h4>
      <h4>${budget}</h4>
      <h4>Due in {moment(due, 'YYYYMMDD').toNow(true)}</h4>
    </TicketContainerStyle>
  );
}

const TicketContainerStyle = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  width: 25%;
  /* width: 100%; */
  height: 100px;
  padding: 10px;
  margin: 10px;
  background-color: ${(p) => p.theme.input.backCol};
  border: 2px solid transparent;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${(p) => p.theme.input.activeCol};
    border: 2px solid white;
  }
`;
