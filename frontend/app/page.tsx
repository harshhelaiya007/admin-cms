import Link from 'next/link';
import { serverAPI } from '@/lib/api-server';

export default async function Home() {
  const posts = await serverAPI.getPublicPosts();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Blog Platform
        </h1>
        <nav>
          <Link href="/admin/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            Admin Login
          </Link>
        </nav>
      </header>

      <main>
        {posts.length === 0 ? (
          <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>No posts available yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {posts.map((post: any) => (
              <article key={post._id} style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <Link href={`/blog/${post.slug}`}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{post.excerpt}</p>
                )}
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem' }}>
                  {post.publishedAt && (
                    <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
                  )}
                  {post.author && (
                    <span style={{ marginLeft: '1rem' }}>By {post.author.username}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
