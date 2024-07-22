export interface Expense {
    id?: string;
    name: string;
    date: Date | string;
    category: string;
    time: string;
    expense_type: string;
    payment_type: string;
    amount: number;
    comments?: string;
  }
  