const API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Server-side API functions (for use in server components)
export const serverAPI = {
  /**
   * Fetch all public posts.
   * Returns an empty array instead of throwing to avoid crashing the page
   * when the API is temporarily unavailable.
   */
  getPublicPosts: async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts/public`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error('Failed to fetch posts', {
          status: res.status,
          statusText: res.statusText,
        });
        return [];
      }

      return res.json();
    } catch (error) {
      console.error('Error while fetching posts', error);
      return [];
    }
  },

  /**
   * Fetch a single public post by slug.
   * Returns null when not found or on error so callers can handle gracefully.
   */
  getPublicPostBySlug: async (slug: string) => {
    try {
      const res = await fetch(`${API_URL}/api/posts/public/${slug}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error('Failed to fetch post', {
          slug,
          status: res.status,
          statusText: res.statusText,
        });
        return null;
      }

      return res.json();
    } catch (error) {
      console.error('Error while fetching post', { slug, error });
      return null;
    }
  },
};
