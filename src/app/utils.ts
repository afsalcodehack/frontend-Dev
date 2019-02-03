// tslint:disable-next-line: triple-equals
export const looseMatch = (operand1, operand2) => operand1 == operand2;

export const matchId = (operand1) => ({ id: operand2 }) => {
  return looseMatch(operand1, operand2);
};
