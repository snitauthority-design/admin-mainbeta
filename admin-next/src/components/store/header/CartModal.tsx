import { X } from 'lucide-react';
import { Product } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { normalizeImageUrl } from '../../../utils/imageUrlHelper';

interface Props { isOpen: boolean; onClose: () => void; cartItems: number[]; catalogSource: Product[]; onToggleCart: (id: number) => void; onCheckout: (id: number) => void; }

export const CartModal = ({ isOpen, onClose, cartItems, catalogSource, onToggleCart, onCheckout }: Props) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-5 sm:p-6 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Crystal blue accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #38BDF8 0%, #0EA5E9 50%, #0284C7 100%)' }} />
        <button className="absolute to p-3 right-3 text-gray-500 hover:text-gray-900 transition" onClick={onClose}><X size={22} /></button>
        <h2 className="text-xl font-bold mb-5 mt-1 text-gray-900">My Cart</h2>
        {cartItems.length === 0 ? <div className="text-center text-gray-500 py-12">No items in cart.</div> : (
          <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {cartItems.map(id => {
              const p = catalogSource.find(x => x.id === id);
              if (!p) return null;
              return (<li key={id} className="flex items-center gap-3 pb-4 border-b last:border-b-0">
                <img src={normalizeImageUrl(p.image)} alt={p.name} className="w-16 h-16 rounded-xl object-cover border shadow-sm" loading="lazy" decoding="async" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-sm font-bold mt-1" style={{ color: '#0EA5E9' }}>৳ {formatCurrency(p.price)}</div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-2 text-sm text-white font-bold rounded-lg transition-all hover:shadow-lg active:scale-95" style={{ background: 'linear-gradient(135deg, #FB923C 0%, #F97316 60%, #EA580C 100%)' }} onClick={() => onCheckout(id)}>Checkout</button>
                    <button className="rounded-lg border border-red-200 text-red-500 text-xs font-semibold px-3 py-2 hover:bg-red-50 transition" onClick={() => onToggleCart(id)}>Remove</button>
                  </div>
                </div>
              </li>);
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CartModal;
