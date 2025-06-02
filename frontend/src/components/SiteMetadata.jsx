import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

export const DefaultMetadata = ({
  title = "NeuroAegis - Early Detection & Alzheimer's Prevention",
  description = "AI-Powered Platform for Early Detection of MCI & Alzheimer's Prevention - Use our innovative tools for cognitive assessment and training",
  keywords = "Alzheimer's, MCI, cognitive health, AI detection, memory, brain health",
  canonicalUrl = '',
  ogImage = '',
  ogType = 'website'
}) => {
  const siteUrl = window.location.origin;
  const fullCanonicalUrl = canonicalUrl ? canonicalUrl : window.location.href;
  const fullOgImageUrl = ogImage ? `${siteUrl}${ogImage}` : '';

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      {fullOgImageUrl && <meta property="og:image" content={fullOgImageUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {fullOgImageUrl && <meta name="twitter:image" content={fullOgImageUrl} />}

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      {fullOgImageUrl && <meta itemProp="image" content={fullOgImageUrl} />}
    </Helmet>
  );
};

DefaultMetadata.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string
};

export default DefaultMetadata; 