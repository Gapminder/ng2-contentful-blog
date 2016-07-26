export interface NodePageContent {
  parent?: any;
  title: string;
  slug: string;
  description?: string;
  related?: NodePageContent[];
  thumbnail: any; // will be changed to sys structure
  createdAt: string;
  url?: string; // for TagComponent
  tags?: string[];
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

export interface ImageContent {
  title: string;
}

export interface Menu {
  fields: any;
  entries: any;
  title: string;
  submenus: Submenu[];
  entryPoint: NodePageContent[];
}

export interface Submenu {
  title: string;
  entries: NodePageContent[];
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
  myLinks: any;
}

export interface ContributionPage {
  description: string;
  article: NodePageContent[];
}
