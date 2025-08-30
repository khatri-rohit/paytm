"use client";

import { useSession } from 'next-auth/react';
import { useState } from 'react';

const Transfer = () => {
  const { data: session, status } = useSession();
  const [amount, setAmount] = useState(0);
  const [bankId, setBankId] = useState(0);

  const sendMoney = async () => {
    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log(token);

      if (!session) {
        console.error("Session is not defined.");
        return;
      }
      const userId = session.user.id;

      if (!userId) {
        console.error("JWT module or userId is not defined.");
        return;
      }

      const _bankId = session.user.bankId;
      if (!_bankId) {
        console.error("Bank ID is not defined.");
        return;
      }

      if (Number(_bankId) === bankId) {
        alert("You cannot transfer money to your own bank account");
        return;
      }

      const transaction = await fetch('/api/ramptranc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          bankId,
          token,
          amount: amount.toString(),
        })
      });

      const data = await transaction.json();
      console.log(data);
      if (data.success) {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const windowWidth = 800;
        const windowHeight = 600;
        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;

        window.open(`http://localhost:3001/transfer?token=${token}&id=${data.transaction.id}&info=${bankId}`, '_blank', `noopener,width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
      } else {
        alert(data.message);
        throw new Error(data.message);
      }

    } catch (error) {
      const err = error as Error;
      console.log(err.message);
      alert(err.message);
    }
  };


  return (
    <div className='text-black flex flex-col gap-3 bg-white p-4 rounded-md shadow-md'>
      <input type="text" className='border border-gray-300 rounded-md p-2 w-40' value={bankId} onChange={(e) => {
        setBankId(parseInt(e.target.value));
      }} />
      <input type="text" className='border border-gray-300 rounded-md p-2 w-40' value={amount} onChange={(e) => {
        setAmount(parseInt(e.target.value));
      }} />
      <button className='bg-blue-500 text-white py-2 px-4 rounded-md w-44'
        onClick={sendMoney}>
        Send Money
      </button>
    </div>);
};

export default Transfer;