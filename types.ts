
export interface Tool {
  id: string;
  name: string;
  description: string;
  isLoaned: boolean;
}

export interface Loan {
  id: string;
  employeeName: string;
  toolId: string;
  loanDate: string;
  returnDate: string | null;
}

export interface User {
  email: string;
}
