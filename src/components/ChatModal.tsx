import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Tag, 
  Check, 
  DollarSign, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatModal: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    sendMessage, 
    respondToOffer,
    currentUser,
    setIsEscrowModalOpen,
    listings,
    openListingDetail
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [customOffer, setCustomOffer] = useState('');

  if (!isChatOpen) return null;

  const currentConv = activeConversation || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentConv) return;
    sendMessage(currentConv.id, messageText.trim());
    setMessageText('');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customOffer.replace(/[^0-9]/g, ''), 10);
    if (isNaN(amount) || amount <= 0 || !currentConv) return;
    sendMessage(
      currentConv.id, 
      `Je vous propose une offre à ${amount.toLocaleString('fr-FR')} FCFA.`, 
      true, 
      amount
    );
    setCustomOffer('');
    setShowOfferInput(false);
  };

  const currentListing = currentConv ? listings.find(l => l.id === currentConv.listingId) : null;

  const quickPrompts = [
    'Toujours disponible ?',
    'Possible de voir aujourd\'hui à Dakar ?',
    'Quel est votre dernier prix ?',
    'Paiement par Wave ou OM possible ?'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Conversations list (on desktop or if no active conversation) */}
        <div className={`w-full md:w-72 border-r border-slate-200 flex flex-col bg-slate-50 ${
          activeConversation ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Messagerie ({conversations.length})</h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                En direct
              </span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors border border-slate-200"
              title="Sortir de la messagerie"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sortir</span>
            </button>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Aucune conversation active
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = currentConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${
                      isSelected ? 'bg-white shadow-sm border-l-4 border-emerald-600' : 'hover:bg-slate-100'
                    }`}
                  >
                    <img 
                      src={conv.listingImage} 
                      alt="" 
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="font-bold text-slate-800 truncate">{conv.sellerName}</span>
                        <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700 truncate">
                        {conv.listingPrice.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {conv.lastMessage}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Conversation Thread */}
        <div className={`flex-1 flex flex-col h-full bg-white ${
          !activeConversation ? 'hidden md:flex items-center justify-center' : 'flex'
        }`}>
          {currentConv ? (
            <>
              {/* Top Header of Chat */}
              <div className="p-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden text-xs text-slate-500 hover:text-slate-800"
                  >
                    ← Retour
                  </button>

                  <img 
                    src={currentConv.listingImage} 
                    alt="" 
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 cursor-pointer"
                    onClick={() => currentListing && openListingDetail(currentListing)}
                  />
                  <div className="min-w-0">
                    <h4 
                      onClick={() => currentListing && openListingDetail(currentListing)}
                      className="text-xs font-bold text-slate-900 truncate cursor-pointer hover:underline"
                    >
                      {currentConv.listingTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-emerald-700 font-mono">
                        {currentConv.listingPrice.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span>·</span>
                      <span>Avec {currentConv.sellerName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentListing && (
                    <button
                      onClick={() => setIsEscrowModalOpen(true)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200"
                    >
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Payer Wave / OM</span>
                    </button>
                  )}

                  {/* Explicit Exit Button requested by user */}
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
                    title="Sortir de la messagerie"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sortir</span>
                  </button>

                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                    title="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                <div className="text-center my-2">
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    Conversation sécurisée SamaDeal · Protégez vos données
                  </span>
                </div>

                {currentConv.messages.map((msg) => {
                  const isMe = currentUser ? msg.senderId === currentUser.id : false;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-emerald-600 text-white rounded-br-sm' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
                      }`}>
                        {/* Offer special card */}
                        {msg.isOffer ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-[10px] opacity-90">
                              <Tag className="w-3 h-3" />
                              <span>Proposition de prix</span>
                            </div>
                            <div className="text-sm font-extrabold font-mono">
                              {msg.offerAmount?.toLocaleString('fr-FR')} FCFA
                            </div>
                            <p className="text-[11px] opacity-90">{msg.text}</p>

                            {/* Offer Status & Response Actions */}
                            {msg.offerStatus === 'pending' && !isMe && (
                              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                                <button
                                  onClick={() => respondToOffer(currentConv.id, msg.id, true)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-lg"
                                >
                                  Accepter
                                </button>
                                <button
                                  onClick={() => respondToOffer(currentConv.id, msg.id, false)}
                                  className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg"
                                >
                                  Refuser
                                </button>
                              </div>
                            )}

                            {msg.offerStatus === 'accepted' && (
                              <div className="pt-1.5 text-[10px] font-bold text-emerald-200 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Offre acceptée !</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(currentConv.id, prompt)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Offer Drawer (if opened) */}
              {showOfferInput && (
                <form onSubmit={handleSendOffer} className="p-3 bg-amber-50 border-t border-amber-200 flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 shrink-0">Votre offre :</span>
                  <input
                    type="number"
                    required
                    value={customOffer}
                    onChange={(e) => setCustomOffer(e.target.value)}
                    placeholder="Montant en FCFA (ex: 260000)"
                    className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
                  >
                    Envoyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOfferInput(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Annuler
                  </button>
                </form>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfferInput(!showOfferInput)}
                  className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors shrink-0"
                  title="Faire une offre de prix"
                >
                  <Tag className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                />

                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center text-sm text-slate-400">
              Sélectionnez une conversation pour échanger
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
