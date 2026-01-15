import { notFound } from 'next/navigation';
import { serverAPI } from '@/lib/api-server';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await serverAPI.getPublicPostBySlug(params.slug);
    
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || '',
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        type: 'article',
        publishedTime: post.publishedAt,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPost({ params }: Props) {
  let post;
  
  try {
    post = await serverAPI.getPublicPostBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Link href="/" style={{ color: '#3b82f6', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Home
      </Link>
      
      <article>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {post.title}
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {post.publishedAt && (
              <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
            )}
            {post.author && (
              <span style={{ marginLeft: '1rem' }}>By {post.author.username}</span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div style={{ lineHeight: '1.75', fontSize: '1.125rem' }}>
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  );
}
