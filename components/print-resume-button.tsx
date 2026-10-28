'use client'

import { track } from '@vercel/analytics'

export function PrintResumeButton() {
  return (
    <button
      type="button"
      className="button button-secondary print-resume-button"
      onClick={() => {
        track('resume_print')
        window.print()
      }}
    >
      Print or save as PDF
    </button>
  )
}
