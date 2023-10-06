export function makeUniquenessResponseMessage(name: string, isAvailable: boolean): string {
  if (isAvailable) {
    return `${name} is available for registration.`;
  } else {
    return `${name} is already in use. Please choose a different one.`;
  }
}

export function makeNotFoundMessage(name: string): string {
  return `The ${name} was not found in the database!`;
}
