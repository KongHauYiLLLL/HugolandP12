import React, { useState } from 'react';
import { useGifts } from '../hooks/useGifts';
import { Gift, Send, X, Coins, Gem, Clock, Check } from 'lucide-react';

interface GiftSystemProps {
  onClose: () => void;
}

export const GiftSystem: React.FC<GiftSystemProps> = ({ onClose }) => {
  const { receivedGifts, sentGifts, unclaimedGifts, sendGift, claimGift, loading } = useGifts();
  const [activeTab, setActiveTab] = useState<'send' | 'received' | 'sent'>('received');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [giftType, setGiftType] = useState<'coins' | 'gems'>('coins');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientUsername.trim() || !amount || sending) return;

    setSending(true);
    const result = await sendGift(
      recipientUsername.trim(),
      giftType,
      parseInt(amount),
      message.trim() || undefined
    );

    if (result.success) {
      setRecipientUsername('');
      setAmount('');
      setMessage('');
      setActiveTab('sent');
    }
    setSending(false);
  };

  const handleClaimGift = async (giftId: string) => {
    await claimGift(giftId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-4 sm:p-6 rounded-lg border border-purple-500/50 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            <div>
              <h2 className="text-white font-bold text-lg sm:text-xl">Gift System</h2>
              <p className="text-purple-300 text-sm">Share resources with other adventurers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unclaimed Gifts Alert */}
        {unclaimedGifts.length > 0 && (
          <div className="bg-green-900/50 border border-green-500/50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold">
                🎁 You have {unclaimedGifts.length} unclaimed gift{unclaimedGifts.length > 1 ? 's' : ''}!
              </span>
            </div>
            <p className="text-green-300 text-sm">
              Check the "Received" tab to claim your gifts before they expire.
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'received', label: 'Received', count: receivedGifts.length },
            { key: 'send', label: 'Send Gift' },
            { key: 'sent', label: 'Sent', count: sentGifts.length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
              {count !== undefined && (
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'send' && (
            <form onSubmit={handleSendGift} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Recipient Username
                </label>
                <input
                  type="text"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Gift Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGiftType('coins')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                        giftType === 'coins'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      Coins
                    </button>
                    <button
                      type="button"
                      onClick={() => setGiftType('gems')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                        giftType === 'gems'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Gem className="w-4 h-4" />
                      Gems
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
                  placeholder="Add a personal message..."
                  rows={3}
                  maxLength={200}
                />
              </div>

              <button
                type="submit"
                disabled={sending || !recipientUsername.trim() || !amount}
                className={`w-full py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  sending || !recipientUsername.trim() || !amount
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending Gift...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Gift
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'received' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
                  <p className="text-white">Loading gifts...</p>
                </div>
              ) : receivedGifts.length > 0 ? (
                receivedGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className={`p-4 rounded-lg border ${
                      gift.is_claimed
                        ? 'bg-gray-800/50 border-gray-600/50'
                        : isExpired(gift.expires_at)
                        ? 'bg-red-900/30 border-red-500/50'
                        : 'bg-green-900/30 border-green-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {gift.gift_type === 'coins' ? (
                          <Coins className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <Gem className="w-6 h-6 text-purple-400" />
                        )}
                        <div>
                          <p className="text-white font-semibold">
                            {gift.amount} {gift.gift_type}
                          </p>
                          <p className="text-gray-400 text-sm">
                            From: {gift.sender_username}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {gift.is_claimed ? (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            <Check className="w-4 h-4" />
                            Claimed
                          </div>
                        ) : isExpired(gift.expires_at) ? (
                          <div className="flex items-center gap-1 text-red-400 text-sm">
                            <Clock className="w-4 h-4" />
                            Expired
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaimGift(gift.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all font-semibold"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                    {gift.message && (
                      <div className="bg-black/30 p-3 rounded-lg">
                        <p className="text-gray-300 text-sm italic">"{gift.message}"</p>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Sent: {formatDate(gift.created_at)}</span>
                      {!gift.is_claimed && !isExpired(gift.expires_at) && (
                        <span>Expires: {formatDate(gift.expires_at)}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Gift className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No gifts received yet</p>
                  <p className="text-gray-500 text-sm">Gifts from other players will appear here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
                  <p className="text-white">Loading sent gifts...</p>
                </div>
              ) : sentGifts.length > 0 ? (
                sentGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="p-4 rounded-lg border bg-gray-800/50 border-gray-600/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {gift.gift_type === 'coins' ? (
                          <Coins className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <Gem className="w-6 h-6 text-purple-400" />
                        )}
                        <div>
                          <p className="text-white font-semibold">
                            {gift.amount} {gift.gift_type}
                          </p>
                          <p className="text-gray-400 text-sm">
                            To: {gift.recipient_username}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {gift.is_claimed ? (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            <Check className="w-4 h-4" />
                            Claimed
                          </div>
                        ) : isExpired(gift.expires_at) ? (
                          <div className="flex items-center gap-1 text-red-400 text-sm">
                            <Clock className="w-4 h-4" />
                            Expired
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-400 text-sm">
                            <Clock className="w-4 h-4" />
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                    {gift.message && (
                      <div className="bg-black/30 p-3 rounded-lg">
                        <p className="text-gray-300 text-sm italic">"{gift.message}"</p>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Sent: {formatDate(gift.created_at)}</span>
                      {gift.is_claimed && gift.claimed_at && (
                        <span>Claimed: {formatDate(gift.claimed_at)}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Send className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No gifts sent yet</p>
                  <p className="text-gray-500 text-sm">Send your first gift to help other adventurers!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};