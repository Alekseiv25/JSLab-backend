function makeUniquenessResponseMessage(entityName, isAvailable) {
  if (isAvailable) {
    return `${entityName} is available for registration.`;
  } else {
    return `${entityName} is already in use. Please choose a different one.`;
  }
}

export default makeUniquenessResponseMessage;
