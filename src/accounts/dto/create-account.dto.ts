export class CreateAccountDto {
  readonly paymentMethod: string;
  readonly verificationMethod: string;
  readonly accountNickname: string;
  readonly accountType: string;
  routingNumber: string;
  accountNumber: string;
}