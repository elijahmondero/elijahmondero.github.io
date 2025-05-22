import React from 'react';
import { useRouter } from 'next/router';
import BlogPost from '../../components/BlogPost';
import { useTheme } from '../../context/ThemeContext';
import { getPostData, getAllPostIds, PostData } from '../../lib/posts'; // Import from the new lib file

interface PostProps {
  post: PostData; // Use the imported PostData interface
}

export async function getStaticPaths() {
  const paths = getAllPostIds(); // Use the function from lib/posts.ts
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id as string); // Use the function from lib/posts.ts
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
