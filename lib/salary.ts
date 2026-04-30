export function calculateSalary({
  hourlyRate,
  hoursPerDay,
  workingDays,
  workedDays,
  fixedExpenses,
}: any) {
  const monthly = hourlyRate * hoursPerDay * workingDays;
  const earned = hourlyRate * hoursPerDay * workedDays;
  const remaining = monthly - earned;
  const afterExpenses = monthly - fixedExpenses;

  return { monthly, earned, remaining, afterExpenses };
}