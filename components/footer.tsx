import Link from 'next/link'
import { FooterActions } from '@/components/footer-actions'
import { contactEmail, secondaryNavigation, socialLinks } from '@/lib/site'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-intro">
          <Link href="/" className="footer-wordmark">
            Jesse Weigel <span>· The Observatory</span>
          </Link>
          <p>Autonomous systems, useful tools, public experiments, and honest field notes.</p>
        </div>

        <div className="footer-column">
          <p className="footer-label">Elsewhere</p>
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href={socialLinks.x} target="_blank" rel="noopener noreferrer">X</a>
        </div>

        <div className="footer-column">
          <p className="footer-label">More</p>
          {secondaryNavigation.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footer-column footer-contact-column">
          <p className="footer-label">Open channel</p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <p>Steubenville, Ohio · working remotely</p>
        </div>
      </div>

      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} Jesse Weigel</p>
        <FooterActions />
      </div>
    </footer>
  )
}
