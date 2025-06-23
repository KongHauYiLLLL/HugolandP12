import { useState, useEffect } from 'react';

export interface Gift {
  id: string;
  sender_id: string;
  sender_username: string;
  recipient_id: string;
  recipient_username: string;
  gift_type: 'coins' | 'gems';
  amount: number;
  message: string | null;
  is_claimed: boolean;
  claimed_at: string | null;
  created_at: string;
  expires_at: string;
}

export const useGifts = () => {
  const [receivedGifts] = useState<Gift[]>([]);
  const [sentGifts] = useState<Gift[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const sendGift = async () => {
    return { success: false, error: 'Gifts disabled in offline mode' };
  };

  const claimGift = async () => {
    return { success: false, error: 'Gifts disabled in offline mode' };
  };

  const loadGifts = async () => {
    // No-op for offline mode
  };

  const unclaimedGifts: Gift[] = [];

  return {
    receivedGifts,
    sentGifts,
    unclaimedGifts,
    loading,
    error,
    sendGift,
    claimGift,
    loadGifts,
  };
};