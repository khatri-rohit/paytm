"use client";

import { makePayment } from '../../actions/makepayment';
import { BankForm } from '@repo/ui/bankform';

export default function Home() {

  return (
    <main>
      <BankForm makePayment={makePayment} />
    </main>
  );
}
