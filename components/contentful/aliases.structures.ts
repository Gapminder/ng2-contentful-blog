import { ContentfulIterableResponse, ContentfulCommon } from 'ng2-contentful';
import {
  NodePageContent, Menu, TagPage, ProfilePage, ContributionPage, HeaderMenu,
  FooterMenu
} from './content-type.structures';
import { Submenu } from './content-type.structures';

export interface ContentfulNodePagesResponse extends ContentfulIterableResponse<ContentfulCommon<NodePageContent>> {}

export interface ContentfulNodePage extends ContentfulCommon<NodePageContent> {}

export interface ContentfulTagPage extends ContentfulCommon<TagPage> {}

export interface ContentfulProfilePage extends ContentfulCommon<ProfilePage> {}

export interface ContentfulContributionPage extends ContentfulCommon<ContributionPage> {}

export interface ContentfulMenu extends ContentfulCommon<Menu> {}

export interface ContentfulSubmenu extends ContentfulCommon<Submenu> {}

export interface ContentfulHeaderMenu extends ContentfulCommon<HeaderMenu> {}

export interface ContentfulFooterMenu extends ContentfulCommon<FooterMenu> {}
