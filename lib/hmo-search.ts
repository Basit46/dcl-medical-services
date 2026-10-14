export function filterHmoPlans(plans: readonly string[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return plans;
  return plans.filter((plan) => plan.toLowerCase().includes(needle));
}