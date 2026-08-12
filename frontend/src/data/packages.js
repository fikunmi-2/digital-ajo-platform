export const packages = [
  {
    id: "1",
    name: "Daily Savings",
    description: "Daily savings plan with fixed contribution amount per day.",
    contribution_type: "Daily",
    fixed_amount: 500,
    target_amount: null,
    lock_period_days: 30,
    commission_type: "First Contribution",
    commission_value: 500,
    currency: "NGN",
    start_date: "2025-01-01",
    is_active: true,
    customers_count: 86
  },
  {
    id: "2",
    name: "Monthly Thrift",
    description: "Monthly savings plan for those who prefer to save once a month.",
    contribution_type: "Monthly",
    fixed_amount: 10000,
    target_amount: null,
    lock_period_days: 90,
    commission_type: "Fixed",
    commission_value: 500,
    currency: "NGN",
    start_date: "2025-01-01",
    is_active: true,
    customers_count: 42
  },
  {
    id: "3",
    name: "Flexible Plan",
    description: "Flexible plan — customers contribute any amount at any time.",
    contribution_type: "Flexible",
    fixed_amount: null,
    target_amount: null,
    lock_period_days: 0,
    commission_type: "Percentage",
    commission_value: 5,
    currency: "NGN",
    start_date: "2025-01-01",
    is_active: false,
    customers_count: 20
  }
]