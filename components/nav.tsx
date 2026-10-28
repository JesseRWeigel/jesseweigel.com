'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { primaryNavigation, secondaryNavigation } from '@/lib/site'

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

export function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="/" className="site-wordmark" aria-label="Jesse Weigel home">
          <span>JW</span>
          <span className="wordmark-name">Jesse Weigel</span>
        </Link>

        <div className="desktop-nav-links">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link href="/contact" className="nav-contact">
            Work with me
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="mobile-nav-panel">
          <div className="mobile-nav-primary">
            {primaryNavigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrentPath(pathname, item.href) ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden="true">0{index + 1}</span>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mobile-nav-secondary">
            {secondaryNavigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
