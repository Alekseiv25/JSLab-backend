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
  | 'Name';

export function makeDeleteMessage(name: nameVariants): string {
  return `${name} was delete from the database!`;
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
