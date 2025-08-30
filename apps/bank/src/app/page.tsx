"use client";

import { makePayment } from '../../actions/makepayment';
import BankForm from '@repo/ui/bank-form';

export default function Home() {

  return (
    <main>
      <BankForm makePayment={makePayment} />
    </main>
  );
}
