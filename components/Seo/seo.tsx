import type { NextPage } from "next";
import Head from "next/head";

interface SeoProps {
  seo_title: string;
  seo_description: string;
}

const SEO: NextPage<SeoProps> = (props) => {
  return (
    <Head>
      <title>{props.seo_title ? props.seo_title : "Django Blog App"}</title>
      <meta
        name="description"
        content={
          props.seo_description ? props.seo_description : "Django Blog App"
        }
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
