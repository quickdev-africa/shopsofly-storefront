declare module "@paystack/inline-js" {
  interface PaystackTransactionOptions {
    key: string;
    email: string;
    amount: number;
    ref?: string;
    currency?: string;
    onSuccess?: (transaction: { reference: string; [key: string]: any }) => void;
    onCancel?: () => void;
    [key: string]: any;
  }

  class PaystackPop {
    newTransaction(options: PaystackTransactionOptions): void;
  }

  export default PaystackPop;
}
