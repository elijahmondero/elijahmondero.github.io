import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

interface BlogSummaryProps {
  title: string;
  excerpt: string;
  link: string;
  datePosted: string;
  dateModified?: string;
  postedBy: string;
  modifiedBy?: string;
  image_path?: string; // Add image_path prop
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

const BlogSummary: React.FC<BlogSummaryProps> = ({ title, excerpt, link, datePosted, dateModified, postedBy, modifiedBy, image_path }) => {
  return (
    <div className="blog-summary">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt,
            "author": postedBy,
            "datePublished": datePosted,
            "dateModified": dateModified,
            "url": window.location.href
          })}
        </script>
      </Helmet>
      <div className="blog-summary-content">
        {image_path && <img src={image_path} alt={title} className="blog-summary-image" />}
        <div className="blog-summary-text">
          <h2>{title}</h2>
          <p>{excerpt}</p>
          <p className="meta"><strong>Posted by:</strong> {postedBy} on {formatDateTime(datePosted)}</p>
          {dateModified && modifiedBy && (
            <p className="meta"><strong>Modified by:</strong> {modifiedBy} on {formatDateTime(dateModified)}</p>
          )}
          <Link to={link} className="read-more">Read more</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogSummary;