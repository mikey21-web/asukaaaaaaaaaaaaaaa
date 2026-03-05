'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard' // Added this import
import { HERO_ETHNIC, HERO_WESTERN, STORES, BRAND_SLIDER_IMAGES, formatPrice } from '@/lib/site-data'
import { getCelebrityProducts, type CatalogProduct } from '@/lib/catalog'
import DigitalStylistSection from '@/components/sections/DigitalStylist'

/* ── Preload celebrity products at module level ── */
export default function Home() {
  const celebrities = getCelebrityProducts()
  const [heroTab, setHeroTab] = useState<'ethnic' | 'western'>('ethnic')

  return (
    <>
      <Header />
      <main style={{ background: 'white' }}>

        {/* ═══ 1. 100vh FULL BLEED HERO (Match Live Site) ═══ */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">

          {/* Centered Typography - Exact match to live site */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 mt-[-5vh]">
            <h1 className="font-serif text-white text-[15vw] sm:text-[10vw] md:text-[8vw] font-normal tracking-[0.2em] leading-none uppercase">
              ASUKĀ
            </h1>
            <p className="font-sans text-white/80 text-[10px] sm:text-[12px] md:text-[14px] tracking-[0.4em] font-light uppercase mt-4 sm:mt-6 text-center">
              A Ritual of Fine Dressing
            </p>

            {/* Buttons - Centered below typography */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full max-w-[600px] mt-16 sm:mt-20">
              <Link href="/make-it-yourself"
                className="w-full sm:w-[240px] text-center px-4 py-4 bg-transparent border border-white/20 text-white/90 font-mono text-[10px] tracking-[3px] uppercase hover:border-white hover:text-white transition-all duration-300">
                Make It Yourself
              </Link>
              <Link href="/sizing"
                className="w-full sm:w-[240px] text-center px-4 py-4 bg-transparent border border-white/20 text-white/90 font-mono text-[10px] tracking-[3px] uppercase hover:border-white hover:text-white transition-all duration-300">
                AI Size Finder
              </Link>
            </div>
          </div>

          {/* Floating Scroll Indicator */}
          <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 text-white/40">
            <span className="font-mono text-[9px] tracking-[3px] uppercase">Scroll To Explore</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </section>

        {/* ═══ 2. DIGITAL STYLIST SECTION ═══ */}
        <DigitalStylistSection />

        {/* ═══ 3. SPOTTED IN ASUKA — Celebrity grid ═══ */}
        <section style={{ padding: '60px 0 40px' }}>
          <div className="page-width" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Spotted in asuka</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {celebrities.map(c => (
                <ProductCard key={c.id} product={c} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/collections/celebrity-styles" style={{
                display: 'inline-block', padding: '14px 40px', border: '1px solid #1a1410',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, letterSpacing: '2px',
                textTransform: 'uppercase', color: '#1a1410', textDecoration: 'none', transition: 'all 0.3s',
              }}>
                View all
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ 3. BRAND SLIDER (Swiper-like auto scroll) ═══ */}
        <section style={{ padding: '20px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '4px', animation: 'brandScroll 40s linear infinite', width: 'max-content' }}>
            {[...BRAND_SLIDER_IMAGES, ...BRAND_SLIDER_IMAGES].map((src, i) => (
              <div key={i} style={{ flex: '0 0 180px', width: '180px', height: '180px', overflow: 'hidden', borderRadius: '50%' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <style>{`@keyframes brandScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
        </section>

        {/* ═══ 4. STORE LOCATOR ═══ */}
        <section style={{ padding: '60px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 400, color: '#1a1410', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>STORE LOCATOR</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {STORES.map(s => (
                <div key={s.city} className="text-center">
                  <a href={s.map} target="_blank" rel="noopener noreferrer">
                    <div className="overflow-hidden mb-4">
                      <img src={s.img} alt={s.city} className="w-full h-auto block" />
                    </div>
                  </a>
                  <h3 className="font-sans text-[21px] font-normal text-[#1a1410] lowercase mb-2">{s.city}</h3>
                  <p className="font-sans text-[15px] font-normal text-[#1a1410] leading-relaxed mb-1">{s.address}</p>
                  <p className="font-sans text-[15px] font-normal text-[#1a1410] leading-relaxed mb-4">{s.hours}</p>
                  <a href={s.map} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 border border-[#1a1410] font-sans text-[12px] font-normal tracking-[2px] lowercase text-[#1a1410] no-underline">get directions</a>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <a href="https://asukacouture.com/pages/book-an-appointment" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block', padding: '14px 40px', border: '1px solid #1a1410',
                fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, letterSpacing: '2px',
                textTransform: 'uppercase', color: '#1a1410', textDecoration: 'none',
              }}>BOOK AN APPOINTMENT</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
