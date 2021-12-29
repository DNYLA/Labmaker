export default interface RedditGatewayMessage {
  /**
   * Operation that is being notified of.
   * Basically the event id.
   */
  op: RedditGatewayOperation;

  /**
   * Payload.
   */
  data: object;
}

export enum RedditGatewayOperation {
  NewPayment = 0,
  UpdatePayment = 1,
  DeletePayment = 2,
}
