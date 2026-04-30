type SalaryInput = {
  hourlyRate: number;
  hoursPerDay: number;
  workingDays: number;
  workedDays: number;
  fixedExpenses: number;
};

export function calculateSalary(input: SalaryInput) {
  const hourlyRate = Number(input.hourlyRate || 0);
  const hoursPerDay = Number(input.hoursPerDay || 0);
  const workingDays = Number(input.workingDays || 0);
  const workedDays = Number(input.workedDays || 0);
  const fixedExpenses = Number(input.fixedExpenses || 0);

  const monthly = hourlyRate * hoursPerDay * workingDays;
  const earned = hourlyRate * hoursPerDay * workedDays;
  const remaining = Math.max(monthly - earned, 0);
  const afterExpenses = monthly - fixedExpenses;
  const currentAfterExpenses = earned - fixedExpenses;

  return {
    monthly,
    earned,
    remaining,
    fixedExpenses,
    afterExpenses,
    currentAfterExpenses,
  };
}