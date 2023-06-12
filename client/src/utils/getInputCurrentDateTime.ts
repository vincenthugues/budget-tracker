export const getInputCurrentDateTime = (): string => {
  const datetime = new Date();

  // Modify date to account for timezone
  datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset());

  return datetime.toISOString().slice(0, -5);
};
