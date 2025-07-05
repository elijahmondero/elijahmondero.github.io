import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostData } from '../lib/posts';

interface BlogSummaryProps {
  post: PostData;
  isDarkTheme: boolean;
}

const BlogSummary: React.FC<BlogSummaryProps> = ({ post, isDarkTheme }) => {
  const { title, excerpt, id, postedBy, image_path, tags, date } = post;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link href={`/post/${id}`} className="blog-card-link">
      <div className={`blog-card ${isDarkTheme ? 'dark' : 'light'}`}>
        {image_path && (
          <div className="card-image-container">
            <Image
              src={image_path}
              alt={title}
              className="card-image"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div className="card-content">
          <div className="card-tags">
            {tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="card-tag">{tag}</span>
            ))}
          </div>
          <h2 className="card-title">{title}</h2>
          <p className="card-excerpt">{excerpt}</p>
          <div className="card-footer">
            <div className="author-info">
              <span className="author-name">{postedBy}</span>
            </div>
            <div className="date-info">
              <span className="publish-date">{formatDate(date)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogSummary;
