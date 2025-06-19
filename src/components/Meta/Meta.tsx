import React from "react";
import Head from "next/head";
import { MetaProps } from "@/interfaces";
import schemaPaintBusiness from "@/tools/schemaPaintBusiness";

const Meta = ({ title, metaTags = [], linkTags = [], children }: MetaProps) => {
  return (
    <Head>
      {title && <title>{title}</title>}
      {metaTags.map((tag, idx) => {
        if (tag.charSet) {
          return <meta key={idx} charSet={tag.charSet} />;
        }
        if (tag.httpEquiv) {
          return (
            <meta key={idx} httpEquiv={tag.httpEquiv} content={tag.content} />
          );
        }
        if (tag.name) {
          return <meta key={idx} name={tag.name} content={tag.content} />;
        }
        if (tag.property) {
          return (
            <meta key={idx} property={tag.property} content={tag.content} />
          );
        }
        return null;
      })}
      {linkTags.map((tag, idx) => (
        <link key={idx} rel={tag.rel} href={tag.href} />
      ))}
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaPaintBusiness),
        }}
      />
    </Head>
  );
};

export default Meta;
