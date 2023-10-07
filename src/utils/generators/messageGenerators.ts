type nameVariants = 'User' | 'Business' | 'Station' | 'Account';

export function makeDeleteMessage(name: nameVariants): string {
  return `${name} was delete from the database!`;
}
