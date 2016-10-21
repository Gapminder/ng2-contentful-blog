import {
  ContentfulNodePage, ContentfulSocial, ContentfulMenu,
  ContentfulMedia, ContentfulTagPage, ContentfulHtmlBlock, ContentfulCover
} from './aliases.structures';
export interface NodePageContent {
  parent?: ContentfulNodePage;
  title: string;
  slug: string;
  description?: string;
  related?: ContentfulNodePage[];
  thumbnail: ContentfulMedia;
  createdAt: string;
  url?: string; // for TagComponent
  tags?: ContentfulTagPage[];
  relatedLocation: boolean;
  entries?: any[];
  cover?: ContentfulMedia; // media
  coverBlock?: ContentfulCover;
}

export interface Block {
  title: string;
  backgroundColor?: string;
  backgroundImage?: ContentfulMedia;
}

export interface VideoBlock extends Block {
  description?: string;
  youtube?: string;
  vimeo?: string;
}

export interface HtmlBlock extends Block {
  content: string;
  fontColor: string;
}

export interface EmbeddedBlock extends Block {
  link: string;
}

export interface VizabiBlock extends Block {
  state: string;
}

export interface Media {
  file: MediaFile;
  title: string;
}
export interface MediaFile {
  url: string;
  fileName: string;
  contentType: string;
}

export interface Image {
  title: string;
  image: ContentfulMedia; // media
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
  thumbnail: ContentfulMedia;
}

export interface TagPage {
  title: string;
  slug: string;
}

export interface ProfilePage {
  userName: string;
  firstName: string;
  lastName: string;
  avatar?: ContentfulMedia;
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
  tags?: ContentfulTagPage[];
}

export interface ContributionPage {
  description: string;
  article: NodePageContent[];
}

export interface Cover {
  title: string;
  background?: ContentfulMedia;
  html?: ContentfulHtmlBlock;
}
