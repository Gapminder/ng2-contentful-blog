# ng2-contentful-blog

Module for creating a blog using [Contentful](https://www.contentful.com/)

### Components & services

1. HeaderMenuComponent
2. FooterMenuComponent
3. BreadcrumbsService
4. BreadcrumbsComponent
5. DynamicRouteConfigurator
6. RoutesGatewayService
7. RoutesGatewayComponent
8. ContenfulContent
9. ContentfulImageDirective
10. EmbeddedEntryComponent
11. HtmlEntryComponent
12. EntriesViewComponent
13. VideoEntryComponent
14. TagsComponent
15. TagComponent
16. MarkdownPipe
17. ToDatePipe

## ng2-contentful-blog components diagram 

![ng2-contentful-blog](./img_contentful/ng2-contentful-blog.png)


## Content model that should exist on Contentful
![contentful-diagram](./img_contentful/contentful-diagram.png)


### `Menu` - includes fields:
  - `name` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Validations: `This field is required`
      - Appearance: `Single line`
  - `submenus` (`References, many`)
  
    Settings:
      - Validations => Specify allowed entry type: `Submenu`
      - Appearance: `Entry links list`
  - `entryPoint` (`Reference`)
  
    Settings:
      - Validations => Specify allowed entry type: `NodePage`
      - Appearance: `Entry link`

### `Submenu` - includes fields:
  - `name` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Validations: `This field is required`
      - Appearance: `Single line`
  - `entryPoint` (`Reference`)
  
    Settings:
      - Validations => Specify allowed entry type: `NodePage`
      - Appearance: `Entry link`
  - `thumbnail` (`Media`)

### `Header` - includes fields:
  - `name` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Validations: `This field is required`
      - Appearance: `Single line`
  - `entries` (`References, many`)
  
    Settings:
      - Validations => Specify allowed entry type: `Menu`
      - Appearance: `Entry links list`

### `Footer` - includes fields:
  - `name` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Validations: `This field is required`
      - Appearance: `Single line`
  - `entries` (`References, many`)
  
    Settings:
      - Validations => Specify allowed entry type: `Menu`
      - Appearance: `Entry links list`

### `Tag` - for creating and attaching tags in `NodePage`, includes fields:
  - `name` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Validations: `This field is required`
      - Appearance: `Slug`
  - `slug` (`Short text`)
  
    Settings:
      - Appearance: `Slug`
      
### `Html` - model that it used to create the html blocks for `NodePage`, includes fields:
  - `name` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Appearance: `Single line`
  - `content` (`Long text`)
  
    Settings:
      - Appearance: `Markdown`
      
### `Video` - model that it used to create the video blocks (via iframe) for `NodePage`, includes fields:
  - `title` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Appearance: `Single line`
  - `description` (`Long text`)
  
    Settings:
      - Appearance: `Markdown`
  - `youtube` (`Short text`)
  - `vimeo` (`Short text`)
  
### `Embedded` - to create a block of any embedded content (via iframe) for `NogePage`, includes fields: 
  - `title` (`Short text`)
  
    Settings:
      - Check: `This field represents the Entry title`
      - Appearance: `Single line`
  - `link` (`Long text`)
  
    Settings:
      - Validations: `This field is required`
      - Appearance: `Single line`
      
### `NodePage` - blueprint of the page for posts/list of posts, includes fields:

  - `title` (`Short text`)
     
    Settings:
      - Check: `This field represents the Entry title`
      - Validations: `This field is required`
      - Appearance: `single line`
  - `type` (`Short text`)
     
    Settings:
      - Validations: `Predefined values`
      - Appearance: `Dropdown`
  - `slug` (`Short text`)
         
    Settings:
      - Appearance: `slug`
  - `thumbnail` (`Media`)
  - `description` (`Long text`)
       
    Settings:
      - Appearance: `Markdown`
  - `entries` (`References, many`)
       
     Settings:
       - Validations => Specify allowed entry type: `Html`, `Video`, `Embedded`
       - Appearance: `Entry links list`
  - `Related nodes` (`References, many`)
      
    Settings:
      - Validations => Specify allowed entry type: `NodePage`
      - Appearance: `Entry links list`
  - `createdAt` (`Date & time`)
      
    Settings:
      - Validations: `This field is required`
  - `show in main page slider` (`Boolean`)
  - `parent` (`Reference`)
      
    Settings:
      - Validations => Specify allowed entry type: `NodePage`
      - Appearance: `Entry link`
  - `tags` (`References, many`)
       
    Settings:
      - Validations => Specify allowed entry type: `Tag`
      - Appearance: `Entry links list` 
      

## Basic usage `NodePage`
Go to `contentful` choose `content` then choose `Add entry` and fill in `NodePage`, for example:

![content](./img_contentful/createContent.jpg)

#### Create first page - Page test
  - `title`: Page test
  - `slug`: page-test
  - `description`: first page
  - `entries` - create new `html`
    
#### Create second page - Sub page
  - `title`: Sub page
  - `slug`: sub-page
  - `description`: Sub page test
  - `entries` - create new `html`
  - `Related nodes`: `Page test` 
  - `parent`: `Page test`
  - `tags`: blog

## Basic usage `Menu`
Go to `contentful` choose `content` then choose `Add entry` and fill in `Menu`, for example:

![content](./img_contentful/createMenu.jpg)

#### Create first menu item 
  - `name`: Menu item
  - `submenus`: select or create `SubMenu`
  
  ***OR***
  
  - `entryPoint`: select or create `NodePage`
  
  ***Note: priority will be `submenus`***
  
    
#### Create HeaderMenu
  - `name`: HeaderMenu
  - `entries`: `Menu item` (your menu item)

### Demo

1. `git clone git@github.com:VS-work/ng2-contentful-blog.git`
2. in folder `ng2-contentful-blog/demo` - open and edit next files:
  - `contentful.json` - add your accessToken and space
 
     ```typescript
     Ng2ContentfulConfig.config = {
       accessToken: CONTENTFUL_ACCESS_TOKEN,
       space: CONTENTFUL_SPACE_ID,
       host: CONTENTFUL_HOST
     };
     ```
     
  - `constIdContentType.json` update all id (keys) according to your `content model` => `JSON preview`, for example 
    ![jsonPreview](./img_contentful/jsonPreview.jpg)
    
     Get value from `sys.id` which is `***YOUR ID***` and put into `constIdContentType.json`:
    
     ```json
     {
       "CONTENTFUL_NODE_PAGE_TYPE_ID": "***YOUR ID***",
       "CONTENTFUL_TAG_TYPE_ID": "***YOUR ID***",
       "VIDEO_CONTENT_ID": "***YOUR ID***",
       "HTML_CONTENT_ID": "***YOUR ID***",
       "EMBEDDED_CONTENT_ID": "***YOUR ID***"
     }
     ```
     
3. `npm i && npm run dev`
4. `localhost:8080/#/*your menu item*` for example `localhost:8080/#/page-test`
