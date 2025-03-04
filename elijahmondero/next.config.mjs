const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  basePath: isProd ? '/elijahmondero.github.io' : '',
  assetPrefix: isProd ? '/elijahmondero.github.io/' : '',
  trailingSlash: true,
};

export default nextConfig;