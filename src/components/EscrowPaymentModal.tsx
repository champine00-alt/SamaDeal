import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  QrCode, 
  Truck, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EscrowPaymentModal: React.FC = () => {
  const { 
    isEscrowModalOpen, 
    setIsEscrowModalOpen, 
    selectedListing, 
    initiateEscrowPayment, 
    currentUser 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money'>('wave');
  const [deliveryType, setDeliveryType] = useState<'hand_delivery' | 'courier'>('courier');
  const [phone, setPhone] = useState(currentUser?.phone || '+221 77 452 89 12');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  if (!isEscrowModalOpen || !selectedListing) return null;

  const itemPrice = selectedListing.price;
  const protectionFee = Math.round(itemPrice * 0.015); // 1.5%
  const deliveryCost = deliveryType === 'courier' ? (selectedListing.deliveryFee || 2000) : 0;
  const totalAmount = itemPrice + protectionFee + deliveryCost;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      initiateEscrowPayment(selectedListing, paymentMethod, deliveryType);
      setStep('select');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Paiement Sécurisé SamaDeal</h3>
              <p className="text-[11px] text-slate-500">Protection acheteur par séquestre Wave & OM</p>
            </div>
          </div>
          <button
            onClick={() => setIsEscrowModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Item summary */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
            <img 
              src={selectedListing.images[0]} 
              alt="" 
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{selectedListing.title}</h4>
              <div className="text-xs text-slate-500 mt-0.5">
                Vendeur : <span className="font-semibold text-slate-700">{selectedListing.seller.name}</span>
              </div>
              <div className="text-xs font-extrabold text-emerald-700 font-mono mt-0.5">
                {selectedListing.price.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>

          {/* Delivery selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Mode de réception
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('courier')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  deliveryType === 'courier'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Livraison à Dakar</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {(selectedListing.deliveryFee || 2000).toLocaleString('fr-FR')} FCFA
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('hand_delivery')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  deliveryType === 'hand_delivery'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Remise en main</span>
                </div>
                <span className="text-[11px] text-slate-500 block">Gratuit (lieu convenu)</span>
              </button>
            </div>
          </div>

          {/* Payment Method Selection: Wave vs Orange Money */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Moyen de paiement sénégalais
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Wave */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wave')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  paymentMethod === 'wave'
                    ? 'border-[#1DA1F2] bg-sky-50 shadow-sm ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-[#1DA1F2] text-white font-extrabold text-xs flex items-center justify-center">
                      ~
                    </div>
                    <span className="text-xs font-bold text-slate-900">Wave Sénégal</span>
                  </div>
                  {paymentMethod === 'wave' && (
                    <CheckCircle2 className="w-4 h-4 text-[#1DA1F2]" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500">1-clic app ou QR code Wave</p>
              </button>

              {/* Orange Money */}
              <button
                type="button"
                onClick={() => setPaymentMethod('orange_money')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  paymentMethod === 'orange_money'
                    ? 'border-[#FF7900] bg-orange-50 shadow-sm ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-[#FF7900] text-white font-extrabold text-xs flex items-center justify-center">
                      OM
                    </div>
                    <span className="text-xs font-bold text-slate-900">Orange Money</span>
                  </div>
                  {paymentMethod === 'orange_money' && (
                    <CheckCircle2 className="w-4 h-4 text-[#FF7900]" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500">Validation via code #144#</p>
              </button>
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Numéro de téléphone mobile (+221)
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">
                {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Prix de l'article</span>
              <span className="font-mono font-semibold">{itemPrice.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                Frais protection séquestre SamaDeal (1.5%)
                <span title="Vos fonds sont protégés jusqu'à conformité" className="cursor-help">ⓘ</span>
              </span>
              <span className="font-mono font-semibold">{protectionFee.toLocaleString('fr-FR')} FCFA</span>
            </div>
            {deliveryType === 'courier' && (
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison</span>
                <span className="font-mono font-semibold">{deliveryCost.toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-bold text-sm">
              <span>Total à régler</span>
              <span className="text-emerald-700 font-mono font-extrabold">
                {totalAmount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* How Escrow Works */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Comment fonctionne le séquestre SamaDeal ?</strong>
              <p className="mt-0.5 text-amber-800 leading-normal">
                Vos {totalAmount.toLocaleString('fr-FR')} FCFA sont bloqués en sécurité. Le vendeur expédie ou apporte l'article. Après inspection, vous validez sur l'application et le vendeur reçoit instantanément ses fonds.
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              paymentMethod === 'wave' 
                ? 'bg-[#1DA1F2] hover:bg-[#0c85d0]' 
                : 'bg-[#FF7900] hover:bg-[#e66c00]'
            } disabled:opacity-50`}
          >
            {isProcessing ? (
              <span>Communication avec {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  Payer {totalAmount.toLocaleString('fr-FR')} FCFA via {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
