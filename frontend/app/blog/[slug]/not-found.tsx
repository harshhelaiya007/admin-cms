import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Post Not Found
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        The blog post you're looking for doesn't exist or hasn't been published yet.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '6px',
          fontWeight: '500',
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
