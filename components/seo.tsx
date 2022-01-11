import React from 'react';

import { DefaultSeo, NextSeo } from "next-seo";
import SEO_CONFIG from "../next-seo-config";
import { IssueData } from '@interfaces/issue-data';

interface ISeoProps{
  issueMeta?: IssueData
}

const Seo: React.FC<ISeoProps> = ({issueMeta}) => {

  if(issueMeta){
    const [repoId, ghId] = issueMeta?.issueId.split(`/`);
    return <NextSeo
      title={issueMeta?.title}
      openGraph={{
        url: `${process.env.NEXT_PUBLIC_HOME_URL}/bounty?id=${ghId}&repoId=${repoId}`,
        title: issueMeta?.title,
        description: issueMeta?.body,
        images: [
          {
            url: issueMeta?.seoImage,
            width: 1200,
            height: 670,
            alt: 'Bounty Info',
            type: 'image/jpeg',
          }
        ],
        site_name: 'bepro',
      }}
      twitter={{
        handle: '@bepronet',
        cardType: issueMeta?.seoImage,
      }}
    />
  }

  return <DefaultSeo {...SEO_CONFIG} />
}

export default Seo;