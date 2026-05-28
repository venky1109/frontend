import { Helmet } from 'react-helmet-async';

const Meta = ({
  title = 'ManaKirana',
  description = 'We sell the best quality groceries for the best rates',
  keywords = 'Groceries',
  canonical,
  image = '/images/logoSquare512_v1.webp',
  type = 'website',
  url,
  jsonLd,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      {canonical && <link rel='canonical' href={canonical} />}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={type} />
      {url && <meta property='og:url' content={url} />}
      <meta property='og:image' content={image} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      {jsonLd && (
        <script type='application/ld+json'>
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default Meta;
