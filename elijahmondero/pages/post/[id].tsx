import React from 'react';
import BlogPost from '../../components/BlogPost';
import { useTheme } from '../../context/ThemeContext';
import { getPostData, getAllPostIds, getRelatedPosts, PostData } from '../../lib/posts';

interface PostProps {
  post: PostData;
  relatedPosts: PostData[];
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id as string);
  const relatedPosts = getRelatedPosts(post.id, post.tags || [], 3);
  return { props: { post, relatedPosts } };
}

const Post = ({ post, relatedPosts }: PostProps) => {
  const { isDarkTheme } = useTheme();

  return (
    <BlogPost
      post={post}
      relatedPosts={relatedPosts}
      isDarkTheme={isDarkTheme}
    />
  );
};

export default Post;
