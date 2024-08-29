import { Helmet } from 'react-helmet-async';

const Meta = ({
  title = 'ManaKirana',
  description = 'We sell the best quality groceries for the best rates',
  keywords = 'Groceries',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

export default Meta;
