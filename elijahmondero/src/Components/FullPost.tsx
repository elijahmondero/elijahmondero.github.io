import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';

interface Post {
  title: string;
  excerpt: string;
  fullPost: string;
  datePosted: string;
  dateModified?: string;
  modifiedBy?: string;
  postedBy: string;
  tags: string[];
  sources: string[];
}

interface FullPostProps {
  posts: { [key: string]: Post };
  fetchFullPost: (id: string) => void;
}

const formatDateTime = (dateTime: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return new Date(dateTime).toLocaleString(undefined, options);
};

const FullPost: React.FC<FullPostProps> = ({ posts, fetchFullPost }) => {
  const { id } = useParams<{ id: string }>();
  const postId = id;

  useEffect(() => {
    fetchFullPost(postId);
  }, [postId, fetchFullPost]);

  const post = posts[postId];

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full-post">
      <Helmet>
        <title>{post.title} - The Tech Oracle</title>
        <meta name="description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "author": post.postedBy,
            "datePublished": post.datePosted,
            "dateModified": post.dateModified,
            "url": window.location.href,
            "articleBody": post.fullPost,
            "keywords": post.tags.join(', '),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          })}
        </script>
      </Helmet>
      <h2>{post.title}</h2>
      <ReactMarkdown>{post.fullPost}</ReactMarkdown>
      <p className="meta"><strong>Posted by:</strong> {post.postedBy} on {formatDateTime(post.datePosted)}</p>
      {post.dateModified && post.modifiedBy && (
        <p className="meta"><strong>Modified by:</strong> {post.modifiedBy} on {formatDateTime(post.dateModified)}</p>
      )}
      <p className="meta"><strong>Tags:</strong> {post.tags.join(', ')}</p>
      {post.sources.length > 0 && (
        <p className="meta"><strong>Sources:</strong> {post.sources.map((source, index) => (
          <a key={index} href={source} target="_blank" rel="noopener noreferrer">{source}</a>
        ))}</p>
      )}
    </div>
  );
};

export default FullPost;