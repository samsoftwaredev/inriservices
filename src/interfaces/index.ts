interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
  charSet?: string;
}

interface LinkTag {
  rel: string;
  href: string;
}

export interface MetaProps {
  title?: string;
  metaTags?: MetaTag[];
  linkTags?: LinkTag[];
  children?: React.ReactNode;
}
