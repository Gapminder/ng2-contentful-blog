import {ContentfulIterableResponse, ContentfulCommon} from 'ng2-contentful/src';
import {NodePageContent, Menu, TagPage} from './content-type.structures';

export interface ContentfulNodePagesResponse extends ContentfulIterableResponse<ContentfulCommon<NodePageContent>> {}

export interface ContentfulNodePage extends ContentfulCommon<NodePageContent> {}

export interface ContentfulTagPage extends ContentfulCommon<TagPage> {}

export interface ContentfulMenu extends ContentfulCommon<Menu> {}
