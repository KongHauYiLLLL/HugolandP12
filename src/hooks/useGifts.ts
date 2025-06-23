import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

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
  const { user, profile } = useAuth();
  const [receivedGifts, setReceivedGifts] = useState<Gift[]>([]);
  const [sentGifts, setSentGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadGifts();
    }
  }, [user]);

  const loadGifts = async () => {
    if (!user) return;

    try {
      // Load received gifts
      const { data: received, error: receivedError } = await supabase
        .from('gifts')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      // Load sent gifts
      const { data: sent, error: sentError } = await supabase
        .from('gifts')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      setReceivedGifts(received || []);
      setSentGifts(sent || []);
    } catch (err) {
      console.error('Error loading gifts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gifts');
    } finally {
      setLoading(false);
    }
  };

  const sendGift = async (
    recipientUsername: string,
    giftType: 'coins' | 'gems',
    amount: number,
    message?: string
  ) => {
    if (!user || !profile) return { success: false, error: 'Not authenticated' };

    try {
      // Check if sender has enough resources
      if (giftType === 'coins' && profile.coins < amount) {
        return { success: false, error: 'Insufficient coins' };
      }
      if (giftType === 'gems' && profile.gems < amount) {
        return { success: false, error: 'Insufficient gems' };
      }

      // Find recipient
      const { data: recipient, error: recipientError } = await supabase
        .from('profiles')
        .select('user_id, username')
        .eq('username', recipientUsername)
        .single();

      if (recipientError || !recipient) {
        return { success: false, error: 'User not found' };
      }

      if (recipient.user_id === user.id) {
        return { success: false, error: 'Cannot send gift to yourself' };
      }

      // Create gift
      const { error: giftError } = await supabase
        .from('gifts')
        .insert({
          sender_id: user.id,
          sender_username: profile.username,
          recipient_id: recipient.user_id,
          recipient_username: recipient.username,
          gift_type: giftType,
          amount,
          message,
        });

      if (giftError) throw giftError;

      // Deduct from sender's resources
      const updates = giftType === 'coins' 
        ? { coins: profile.coins - amount }
        : { gems: profile.gems - amount };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await loadGifts();
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send gift';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const claimGift = async (giftId: string) => {
    if (!user || !profile) return { success: false, error: 'Not authenticated' };

    try {
      const gift = receivedGifts.find(g => g.id === giftId);
      if (!gift) {
        return { success: false, error: 'Gift not found' };
      }

      if (gift.is_claimed) {
        return { success: false, error: 'Gift already claimed' };
      }

      if (new Date(gift.expires_at) < new Date()) {
        return { success: false, error: 'Gift has expired' };
      }

      // Claim gift
      const { error: claimError } = await supabase
        .from('gifts')
        .update({
          is_claimed: true,
          claimed_at: new Date().toISOString(),
        })
        .eq('id', giftId);

      if (claimError) throw claimError;

      // Add to recipient's resources
      const updates = gift.gift_type === 'coins'
        ? { coins: profile.coins + gift.amount }
        : { gems: profile.gems + gift.amount };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await loadGifts();
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim gift';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const unclaimedGifts = receivedGifts.filter(
    gift => !gift.is_claimed && new Date(gift.expires_at) > new Date()
  );

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