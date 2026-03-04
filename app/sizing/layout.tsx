import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Sizing Guide | Find Your Perfect Fit | Asuka Couture',
    description: 'Use Asuka Couture\'s AI-powered sizing guide to find your perfect fit. Smart body measurements and brand comparison for luxury Indian menswear.',
}

export default function SizingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
