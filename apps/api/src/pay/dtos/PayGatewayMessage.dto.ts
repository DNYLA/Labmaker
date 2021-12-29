export default interface PayGatewayMessage {
  /**
   * Operation that is being notified of.
   * Basically the event id.
   */
  op: PayGatewayOperation;

  /**
   * Payload.
   */
  data: object;
}

export enum PayGatewayOperation {
  PaymentCompleted = 100,
}
