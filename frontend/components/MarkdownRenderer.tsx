'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        h1: ({ node, ...props }) => (
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.25rem', marginBottom: '0.5rem' }} {...props} />
        ),
        p: ({ node, ...props }) => (
          <p style={{ marginBottom: '1rem' }} {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc' }} {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'decimal' }} {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            style={{
              borderLeft: '4px solid #3b82f6',
              paddingLeft: '1rem',
              marginLeft: '0',
              marginBottom: '1rem',
              fontStyle: 'italic',
              color: '#6b7280',
            }}
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a style={{ color: '#3b82f6', textDecoration: 'underline' }} {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
