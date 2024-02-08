type nameVariants =
  | 'User'
  | 'Users'
  | 'Business'
  | 'Businesses'
  | 'Station'
  | 'Stations'
  | 'Account'
  | 'Accounts'
  | 'Email'
  | 'Name'
  | 'Operations'
  | 'Operation'
  | 'Fuel Prices'
  | 'Fuel Price'
  | 'Token'
  | 'Transactions'
  | 'Transaction'
  | 'Payments'
  | 'Payment'
  | 'Notifications';

export function makeDeleteMessage(name: nameVariants): string {
  return `${name} was deleted from the database!`;
}

export function makeNotFoundMessage(name: nameVariants): string {
  return `${name} was not found in the database!`;
}

export function makeConflictMessage(name: nameVariants): string {
  return `${name} is already in use. Please choose a different one!`;
}

export function makeAvailableMessage(name: nameVariants): string {
  return `${name} is available for registration!`;
}

export function makeUnauthorizedMessage(): string {
  return `Unauthorized!`;
}

export function makeNotCorrectDataMessage(): string {
  return `Incorrect email or password.`;
}

export function makeSuspendMessage(): string {
  return `Your account has been suspended. Please contact your business administrator for details.`;
}

export function makeNotValidPasswordMessage(): string {
  return `Incorrect password.`;
}

export function makeValidPasswordMessage(): string {
  return `Password is correct.`;
}

export function makeSuccessSendingMessage(): string {
  return `Successfully sent.`;
}

export function makeSuccessUpdatingMessage(): string {
  return `Successfully updated.`;
}

export function makeSuccessInvitingMessage(): string {
  return `Successfully invited.`;
}

export function makeAlreadyActivatedMessage(): string {
  return `Account already activated.`;
}

export function makeNotActivatedAccountMessage(): string {
  return 'The account has not been activated.';
}

export function makeSucceededMessage(): string {
  return 'The request succeeded.';
}
