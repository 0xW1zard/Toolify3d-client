'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oxanium:wght@700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '2rem clamp(1.25rem, 4vw, 3rem)',
          background: '#0D0D0D',
          color: '#ffffff',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#1DB954',
          }}
        >
          {'// CRITICAL_ERROR'}
        </p>
        <h1
          style={{
            margin: '1rem 0 0.75rem',
            fontFamily: "'Oxanium', sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          System fault
        </h1>
        <p style={{ margin: '0 0 2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '28rem' }}>
          The app hit a root-level error. Retry the page or come back shortly.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            fontFamily: "'Oxanium', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            padding: '0.875rem 1.75rem',
            border: 'none',
            borderRadius: '2px',
            background: '#1DB954',
            color: '#0D0D0D',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
