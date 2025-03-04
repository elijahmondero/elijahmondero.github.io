import React from 'react';
import { useRouter } from 'next/router';
import BlogPost from '../../components/BlogPost';
import fs from 'fs';
import path from 'path';
import { useTheme } from '../../context/ThemeContext';

interface Post {
  title: string;
  excerpt: string;
  content: string;
  datePosted: string;
  dateModified?: string;
  modifiedBy?: string;
  postedBy: string;
  tags: string[];
  sources: string[];
  image_path?: string;
}

interface PostProps {
  post: Post;
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'public', 'posts', 'index.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const posts = JSON.parse(jsonData);
  const paths = posts.map((post: { id: string }) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'public', 'posts', `${params.id}.json`);
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const post = JSON.parse(jsonData);
  return { props: { post } };
}

const Post = ({ post }: PostProps) => {
  const { isDarkTheme } = useTheme();
  const router = useRouter();
  const { id } = router.query;

  return (
    <BlogPost
      post={post}
      isDarkTheme={isDarkTheme} // Pass the isDarkTheme prop
    />
  );
};

export default Post;