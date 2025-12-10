import React from 'react';
import { Stop } from '../types';
import { X, Sparkles, Share2 } from 'lucide-react';

interface DeliveryModalProps {
  stop: Stop;
  imageUrl: string | undefined;
  onClose: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ stop, imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10 flex justify-between items-start">
             <div className="text-white drop-shadow-md">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="text-yellow-400" /> Delivery Confirmed
                </h2>
                <p className="text-sm opacity-90">{stop.city}, {stop.country}</p>
             </div>
             <button onClick={onClose} className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur transition-colors">
                <X className="w-5 h-5" />
             </button>
        </div>

        {/* Image Content */}
        <div className="aspect-video w-full bg-slate-950 relative">
             <img 
                src={imageUrl} 
                alt="Santa delivery proof" 
                className="w-full h-full object-cover"
             />
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent pt-20">
                <div className="flex justify-between items-end">
                    <div>
                         <p className="text-slate-300 text-sm mb-1 uppercase tracking-wider font-bold">Proof of Delivery</p>
                         <h3 className="text-2xl font-bold text-white mb-1">Gift: {stop.gift}</h3>
                         <p className="text-slate-400">Recipient: <span className="text-red-400 font-bold">{stop.kidName}</span></p>
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </div>
             </div>
        </div>

        {/* Footer Progress */}
        <div className="h-1 w-full bg-slate-800">
            <div className="h-full bg-red-500 animate-[width_5s_linear]" style={{width: '100%'}}></div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
