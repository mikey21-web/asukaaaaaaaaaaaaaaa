'use client'
import { useEffect } from 'react'

export default function CustomCursor() {
    useEffect(() => {
        // Only on desktop (no touch)
        if (typeof window === 'undefined' || 'ontouchstart' in window) return

        const cursor = document.createElement('div')
        cursor.id = 'asuka-cursor'
        cursor.innerHTML = `
      <div style="width:8px;height:8px;background:#a17a58;border-radius:50%;transition:transform 0.15s ease;pointer-events:none;"></div>
    `
        Object.assign(cursor.style, {
            position: 'fixed', top: '0', left: '0', zIndex: '99999',
            pointerEvents: 'none', transform: 'translate(-50%,-50%)',
            mixBlendMode: 'difference',
        })
        document.body.appendChild(cursor)
        document.body.style.cursor = 'none'

        const move = (e: MouseEvent) => {
            cursor.style.top = e.clientY + 'px'
            cursor.style.left = e.clientX + 'px'
        }
        const grow = () => {
            const dot = cursor.firstElementChild as HTMLElement
            if (dot) dot.style.transform = 'scale(3.5)'
        }
        const shrink = () => {
            const dot = cursor.firstElementChild as HTMLElement
            if (dot) dot.style.transform = 'scale(1)'
        }

        document.addEventListener('mousemove', move)
        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', grow)
            el.addEventListener('mouseleave', shrink)
        })

        // Re-bind on DOM changes
        const observer = new MutationObserver(() => {
            document.querySelectorAll('a, button, [role="button"]').forEach(el => {
                el.removeEventListener('mouseenter', grow)
                el.removeEventListener('mouseleave', shrink)
                el.addEventListener('mouseenter', grow)
                el.addEventListener('mouseleave', shrink)
            })
        })
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            document.removeEventListener('mousemove', move)
            observer.disconnect()
            cursor.remove()
            document.body.style.cursor = ''
        }
    }, [])

    return null
}
