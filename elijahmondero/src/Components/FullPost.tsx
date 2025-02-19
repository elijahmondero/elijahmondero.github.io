import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';
import Giscus from '@giscus/react';

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
  image_path?: string; // Add image_path prop
}

interface FullPostProps {
  posts: { [key: string]: Post };
  fetchFullPost: (id: string) => void;
  isDarkTheme: boolean; // Add isDarkTheme prop
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

const FullPost: React.FC<FullPostProps> = ({ posts, fetchFullPost, isDarkTheme }) => {
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
      <title>{post.title} - The Tech Oracle</title>
      <meta name="description" content={post.excerpt} />
      <div className="full-post-content">
        {post.image_path && <img src={post.image_path} alt={post.title} className="full-post-image" />}
        <div className="full-post-text">
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
      </div>
      <Giscus
        repo="elijahmondero/elijahmondero.github.io"
        repoId="R_kgDOMKsj5g"
        category="General"
        categoryId="General"
        mapping="specific"
        term={postId}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={isDarkTheme ? "dark" : "light"} // Use isDarkTheme to set the theme
        lang="en"
        loading="lazy"
      />
    </div>
  );
};

export default FullPost;