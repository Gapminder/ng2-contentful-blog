export interface NodePageContent {
  parent?: any;
  title: string;
  type: string;
  slug: string;
  description?: string;
  relatedEntries?: NodePageContent[];
  thumbnail: any; // will be changed to sys structure
  createdAt: string;
  url?: string;
}

export interface VideoContent {
  title: string;
  description?: string;
  youtube?: string;
  vimeo?: string;
}

export interface HtmlContent {
  name: string;
  content: string;
}

export interface ImageContent {
  title: string;
}

export interface Menu {
  fields: any;
  entries: Menu[];
  name: string;
  submenus: Menu[];
  entryPoint: Menu[];
}

export interface TagPage {
  name: string;
  slug: string;
}
