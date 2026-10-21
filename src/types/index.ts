export interface Wish {
  id: string;
  name: string;
  attendance: 'attending' | 'not-attending';
  guests: number;
  message: string;
  createdAt: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  holderName: string;
}
