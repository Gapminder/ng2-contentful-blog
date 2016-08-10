import { ContentfulNodePage, ContentfulSocial, ContentfulMenu } from './aliases.structures';
export interface NodePageContent {
  parent?: ContentfulNodePage;
  title: string;
  slug: string;
  description?: string;
  related?: NodePageContent[];
  thumbnail: any; // will be changed to sys structure
  createdAt: string;
  url?: string; // for TagComponent
  tags?: string[];
  relatedLocation: boolean;
  entries?: any[];
}

export interface VideoContent {
  title: string;
  description?: string;
  youtube?: string;
  vimeo?: string;
}

export interface HtmlContent {
  title: string;
  content: string;
}

export interface Image {
  title: string;
  image: any; // media
}

export interface FooterMenu {
  menus: Menu[];
  social: ContentfulSocial;
  description: string;
}
export interface FooterHeader {
  entries: ContentfulMenu[];
  title: string;
  tag: string;
  social?: ContentfulSocial;
  description?: string;
}

export interface Social {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  google?: string;
  youtube?: string;
}

export interface Menu {
  title: string;
  submenus?: Submenu[];
  entryPoint?: ContentfulNodePage;
}

export interface Submenu {
  title: string;
  entryPoint: ContentfulNodePage;
  thumbnail: any;
}

export interface TagPage {
  title: string;
  slug: string;
}

export interface ProfilePage {
  userName: string;
  firstName: string;
  lastName: string;
  avatar?: any;
  title: string;
  location: string;
  email: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  google?: string;
  aboutMe: string;
  contributions: ContributionPage[];
  myLinks: any[];
}

export interface ContributionPage {
  description: string;
  article: NodePageContent[];
}
