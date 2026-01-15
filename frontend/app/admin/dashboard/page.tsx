'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsAPI } from '@/lib/api';
import { removeAuthToken } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeAuthToken();
        router.push('/admin/login');
      } else {
        setError('Failed to load posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.delete(id);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err: any) {
      alert('Failed to delete post');
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link
                href="/"
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Blog Posts</h2>
            <Link
              href="/admin/posts/new"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '6px',
                fontWeight: '500',
                display: 'inline-block',
              }}
            >
              New Post
            </Link>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px' }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No posts yet.</p>
              <Link
                href="/admin/posts/new"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: '500',
                  display: 'inline-block',
                }}
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Title</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Created</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <Link
                          href={`/admin/posts/${post._id}`}
                          style={{ color: '#3b82f6', fontWeight: '500' }}
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            backgroundColor: post.published ? '#d1fae5' : '#fee2e2',
                            color: post.published ? '#065f46' : '#991b1b',
                          }}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Link
                            href={`/admin/posts/${post._id}`}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                            }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
