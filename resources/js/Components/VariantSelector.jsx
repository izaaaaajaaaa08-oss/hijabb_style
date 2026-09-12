import React from 'react';

const COLOR_MAP = {
    'Hitam': '#1F2937',
    'Maroon': '#800020',
    'Dusty Pink': '#E8B4B8',
    'Sage Green': '#A8BBA3',
    'Cream': '#F5E8D3',
    'Mocca': '#967969',
    'Navy': '#000080',
    'Abu-abu': '#9CA3AF',
    'Coklat': '#78350F',
    'Putih': '#FFFFFF',
};

export default function VariantSelector({ variants = [], selectedVariant, onSelectVariant }) {
    if (!variants || variants.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-brand-text">Pilih Warna:</span>
                    {selectedVariant && (
                        <span className="text-sm font-medium text-brand-pink-hover">
                            {selectedVariant.color}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        const isOutOfStock = variant.stock <= 0;
                        const hexColor = COLOR_MAP[variant.color] || '#D1D5DB';

                        return (
                            <button
                                key={variant.id}
                                type="button"
                                onClick={() => !isOutOfStock && onSelectVariant(variant)}
                                disabled={isOutOfStock}
                                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                                    isSelected
                                        ? 'border-brand-pink bg-brand-pink/15 text-brand-text ring-2 ring-brand-pink/50 shadow-sm'
                                        : isOutOfStock
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                        : 'border-gray-200 bg-white text-brand-text hover:border-brand-pink/60 hover:bg-brand-cream/40'
                                }`}
                            >
                                <span
                                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner inline-block"
                                    style={{ backgroundColor: hexColor }}
                                />
                                <span>{variant.color}</span>
                                {variant.size && variant.size !== 'All Size' && (
                                    <span className="text-brand-text/60 text-[10px]">({variant.size})</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stock and detail status */}
            {selectedVariant && (
                <div className="rounded-lg bg-brand-cream/60 p-3 text-xs flex items-center justify-between border border-brand-cream-dark/50">
                    <div>
                        <span className="text-brand-text/70">SKU: </span>
                        <span className="font-mono font-medium text-brand-text">{selectedVariant.sku}</span>
                    </div>
                    <div>
                        {selectedVariant.stock <= 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                                Stok Habis
                            </span>
                        ) : selectedVariant.stock <= 5 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                                Stok Terbatas ({selectedVariant.stock} tersisa)
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                Tersedia ({selectedVariant.stock} pcs)
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
