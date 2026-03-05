'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import { getProductByHandle } from '@/lib/catalog'
import { formatPrice } from '@/lib/site-data'
import { SizerPanel } from '@/components/widget/AIWidget'

const BRAND_COPPER = '#a17a58'
const BRAND_INK = '#1a1410'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']

/* ── Brand-to-Asuka size mapping ── */
const BRAND_SIZES: Record<string, Record<string, { asuka: string; confidence: number }>> = {
    'Zara': { 'S': { asuka: 'S', confidence: 90 }, 'M': { asuka: 'M', confidence: 92 }, 'L': { asuka: 'L', confidence: 91 }, 'XL': { asuka: 'XL', confidence: 89 }, '38': { asuka: 'S', confidence: 88 }, '40': { asuka: 'M', confidence: 90 }, '42': { asuka: 'L', confidence: 88 } },
    'H&M': { 'S': { asuka: 'S', confidence: 88 }, 'M': { asuka: 'M', confidence: 90 }, 'L': { asuka: 'L', confidence: 89 }, 'XL': { asuka: 'XL', confidence: 87 } },
    'Uniqlo': { 'S': { asuka: 'M', confidence: 85 }, 'M': { asuka: 'M', confidence: 88 }, 'L': { asuka: 'L', confidence: 87 }, 'XL': { asuka: 'XL', confidence: 86 } },
    'Raymond': { 'S': { asuka: 'S', confidence: 93 }, 'M': { asuka: 'M', confidence: 94 }, 'L': { asuka: 'L', confidence: 93 }, 'XL': { asuka: 'XL', confidence: 92 }, '38': { asuka: 'S', confidence: 91 }, '40': { asuka: 'M', confidence: 93 }, '42': { asuka: 'L', confidence: 92 }, '44': { asuka: 'XL', confidence: 90 } },
    'Allen Solly': { 'S': { asuka: 'S', confidence: 90 }, 'M': { asuka: 'M', confidence: 91 }, 'L': { asuka: 'L', confidence: 90 }, 'XL': { asuka: 'XL', confidence: 89 }, '38': { asuka: 'S', confidence: 88 }, '40': { asuka: 'M', confidence: 90 }, '42': { asuka: 'L', confidence: 89 } },
    'Louis Philippe': { 'S': { asuka: 'S', confidence: 91 }, 'M': { asuka: 'M', confidence: 93 }, 'L': { asuka: 'L', confidence: 92 }, 'XL': { asuka: 'XL', confidence: 90 } },
    'Peter England': { 'S': { asuka: 'S', confidence: 88 }, 'M': { asuka: 'M', confidence: 89 }, 'L': { asuka: 'M', confidence: 85 }, 'XL': { asuka: 'L', confidence: 86 } },
    'Mango': { 'S': { asuka: 'S', confidence: 87 }, 'M': { asuka: 'M', confidence: 89 }, 'L': { asuka: 'L', confidence: 88 }, 'XL': { asuka: 'XL', confidence: 86 } },
    'Van Heusen': { 'S': { asuka: 'S', confidence: 91 }, 'M': { asuka: 'M', confidence: 92 }, 'L': { asuka: 'L', confidence: 91 }, 'XL': { asuka: 'XL', confidence: 90 } },
    'Other': { 'S': { asuka: 'S', confidence: 80 }, 'M': { asuka: 'M', confidence: 82 }, 'L': { asuka: 'L', confidence: 80 }, 'XL': { asuka: 'XL', confidence: 78 } },
}
const BRAND_LIST = Object.keys(BRAND_SIZES)
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '38', '40', '42', '44']
const FIT_OPTIONS = ['Slim Fit', 'Regular Fit', 'Relaxed Fit']

export default function ProductPage() {
    const { id } = useParams()
    const handle = id as string
    const product = getProductByHandle(handle)

    const [selectedSize, setSelectedSize] = useState('')
    const [mainImgIdx, setMainImgIdx] = useState(0)
    const [showAISizer, setShowAISizer] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size first.")
            return
        }
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 3000)
    }

    // Sizer state — button-based steps

    if (!product) {
        return (
            <>
                <Header />
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fffdfd' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', color: BRAND_INK, marginBottom: '16px' }}>Product not found</div>
                        <Link href="/collections/luxury-men-clothing" style={{ color: BRAND_COPPER, fontFamily: 'var(--font-sans)', fontSize: '13px', letterSpacing: '1px' }}>← Browse all products</Link>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    const images = product.all_images.length > 0 ? product.all_images : (product.first_image !== 'NO IMAGE' ? [product.first_image] : [])

    function calculateSize() { }
    function resetSizer() { }

    const btnBase = { fontFamily: 'var(--font-sans)', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #ddd', background: 'white', color: BRAND_INK, padding: '10px 16px' }

    return (
        <>
            <Header />
            <main style={{ background: '#fffdfd', paddingTop: '20px', paddingBottom: '80px' }}>
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">

                    {/* Breadcrumb */}
                    <nav className="mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '1px', color: '#888' }}>
                        <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
                        <span style={{ margin: '0 8px' }}>/</span>
                        <span style={{ color: BRAND_INK }}>{product.title}</span>
                    </nav>

                    {/* Product layout — stacks vertically on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">

                        {/* LEFT: Image gallery */}
                        <div>
                            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f5f0e8', marginBottom: '12px' }}>
                                {images[mainImgIdx] && (
                                    <img src={images[mainImgIdx]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                            </div>
                            {images.length > 1 && (
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                                    {images.map((img, idx) => (
                                        <button type="button" key={idx} onClick={() => setMainImgIdx(idx)}
                                            style={{ flex: '0 0 72px', width: '72px', height: '96px', overflow: 'hidden', border: mainImgIdx === idx ? `2px solid ${BRAND_COPPER}` : '2px solid transparent', cursor: 'pointer', background: '#f5f0e8', padding: 0 }}>
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Product info */}
                        <div className="md:sticky md:top-[120px]">
                            <h1 className="font-serif text-[28px] md:text-[34px] font-normal text-[#1a1410] uppercase tracking-[1.5px] leading-tight mb-3">
                                {product.title}
                            </h1>
                            <div className="font-sans text-[18px] md:text-[20px] font-normal text-[#a57a5a] mb-8">
                                {formatPrice(product.price)}
                            </div>

                            {/* Size selector */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-sans text-[12px] font-medium text-[#1a1410] uppercase tracking-widest">Size</span>
                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => setShowAISizer(!showAISizer)}
                                            className="bg-transparent border-none text-[#a57a5a] font-sans text-[11px] font-medium cursor-pointer underline underline-offset-4 decoration-[#a57a5a]/30 hover:decoration-[#a57a5a] transition-all flex items-center gap-1.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                            AI Size Finder
                                        </button>
                                        <span className="font-sans text-[12px] text-[#ddd]">|</span>
                                        <a href="https://wa.me/919063356542" target="_blank" rel="noopener noreferrer"
                                            className="font-sans text-[11px] text-[#1a1410] underline underline-offset-4 decoration-black/20 hover:decoration-black transition-all">
                                            Custom Size
                                        </a>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {SIZES.map(size => (
                                        <button type="button" key={size} onClick={() => setSelectedSize(size)}
                                            className={`min-w-[50px] h-[40px] px-3 font-sans text-[11px] uppercase tracking-wider cursor-pointer border transition-colors duration-200
                                                        ${selectedSize === size ? 'border-[#1a1410] bg-[#1a1410] text-white' : 'border-[#e0e0e0] bg-white text-[#1a1410] hover:border-black'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {showAISizer && (
                                    <div className="bg-[#fcf9f6] border border-[#e8e0d6] rounded-sm p-6 mb-8 animate-fadeIn">
                                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e8e0d6]">
                                            <h3 className="font-serif text-[#1a1410] text-lg">AI Size Consultant</h3>
                                            <button type="button" onClick={() => setShowAISizer(false)} className="text-[#a57a5a] hover:text-[#1a1410] transition-colors p-2">✕</button>
                                        </div>
                                        <SizerPanel />
                                    </div>
                                )}
                            </div>

                            {/* CTA buttons */}
                            <div className="flex flex-col gap-3 mb-10 w-full">
                                <button type="button" onClick={handleAddToCart}
                                    className={`w-full h-[50px] font-sans text-[11px] font-semibold tracking-[2px] uppercase cursor-pointer transition-all duration-300 border-none
                                                  ${addedToCart ? 'bg-[#a57a5a] text-white' : 'bg-[#1a1410] text-white hover:bg-[#a57a5a]'}`}>
                                    {addedToCart ? 'Added to Cart!' : 'Add To Cart'}
                                </button>

                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <Link href="/make-it-yourself"
                                        className="w-full h-[50px] flex items-center justify-center gap-2 bg-transparent text-[#1a1410] border border-[#a57a5a] 
                                                     font-sans text-[10px] font-semibold tracking-[1.5px] uppercase cursor-pointer transition-all duration-300 hover:bg-[#a57a5a] hover:text-white no-underline">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        Make It Yourself
                                    </Link>
                                    <a href={`https://wa.me/919063356542?text=Hi, I'm interested in ${encodeURIComponent(product.title)} (${formatPrice(product.price)})`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full h-[50px] flex items-center justify-center gap-2 bg-transparent text-[#1a1410] border border-[#1a1410] 
                                                   font-sans text-[10px] font-semibold tracking-[1.5px] uppercase cursor-pointer transition-all duration-300 hover:bg-black hover:text-white no-underline">
                                        WhatsApp Inquiry
                                    </a>
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ borderTop: '1px solid #eee' }}>
                                <details open style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                                    <summary style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Description <span>+</span>
                                    </summary>
                                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', lineHeight: 1.6, color: '#666', marginTop: '16px' }}>
                                        {product.description && product.description !== 'No description' && <p className="mb-4"><strong>Details:</strong> {product.description.replace(/<[^>]*>?/gm, '')}</p>}
                                        <p>Crafted with precision, this piece embodies the ritual of fine dressing. Each garment is traditionally tailored holding true to ASUKĀ’s 35 years of heritage.</p>
                                    </div>
                                </details>
                                <details style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                                    <summary style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Shipping & Returns <span>+</span>
                                    </summary>
                                    <div style={{ paddingTop: '16px', fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                                        <p>Free shipping on all orders above Rs. 5,000.</p>
                                        <p>30-day hassle-free returns with postage paid.</p>
                                        <p>Custom-sized orders are non-returnable.</p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complete the Look Cross-Sell */}
                <div className="max-w-[1200px] mx-auto px-4 md:px-10 mt-24">
                    <h3 className="font-serif text-3xl font-light text-[#1a1410] text-center mb-10">Complete the Look</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {['embroidered-shoes-for-men', 'embroidered-shoes-for-men', 'embroidered-stoles', 'embroidered-stoles'].map((col, i) => {
                            const p = getProductByHandle(col === 'embroidered-shoes-for-men' ? (i === 0 ? 'olive-green-velvet-embroidered-shoes' : 'black-velvet-embroidered-shoes') : (i === 2 ? 'ivory-embroidered-stole' : 'maroon-velvet-embroidered-stole'))
                            if (!p) return null
                            return (
                                <Link href={`/products/${p.handle}`} key={p.handle} className="group block no-underline">
                                    <div className="aspect-[2/3] overflow-hidden mb-4 bg-[#f5ede3] product-img-wrap rounded-sm shadow-sm">
                                        <img src={p.first_image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-serif text-sm md:text-base text-[#1a1410] mb-2">{p.title}</h4>
                                        <p className="font-sans text-[11px] text-[#7A6A5A] uppercase tracking-wider">{formatPrice(p.price)}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </main >
            <Footer />
        </>
    )
}
