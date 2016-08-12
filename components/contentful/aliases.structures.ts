import { ContentfulIterableResponse, ContentfulCommon } from 'ng2-contentful';
import {
  NodePageContent, Menu, TagPage, ProfilePage, ContributionPage, FooterHeader,
  FooterMenu, Submenu, Image, Social
} from './content-type.structures';

export interface ContentfulNodePagesResponse extends ContentfulIterableResponse<ContentfulCommon<NodePageContent>> {}

export interface ContentfulNodePage extends ContentfulCommon<NodePageContent> {}

export interface ContentfulTagPage extends ContentfulCommon<TagPage> {}

export interface ContentfulProfilePage extends ContentfulCommon<ProfilePage> {}

export interface ContentfulContributionPage extends ContentfulCommon<ContributionPage> {}

export interface ContentfulMenu extends ContentfulCommon<Menu> {}

export interface ContentfulSubmenu extends ContentfulCommon<Submenu> {}

export interface ContentfulFooterHeader extends ContentfulCommon<FooterHeader> {}

export interface ContentfulFooterMenu extends ContentfulCommon<FooterMenu> {}

export interface ContentfulImage extends ContentfulCommon<Image> {}

export interface ContentfulSocial extends ContentfulCommon<Social> {}
