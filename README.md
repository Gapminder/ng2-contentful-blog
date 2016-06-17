# Component ng2-gapminder

Component to create a blog using [Contentful](https://www.contentful.com/)

### Components & services

1. BreadcrumbsService
2. BreadcrumbsComponent
3. DynamicRouteConfigurator
4. RoutesGatewayService
5. RoutesGatewayComponent
6. ContenfulContent
7. ContentfulImageDirective
8. EmbeddedEntryComponent
9. HtmlEntryComponent
10. EntriesViewComponent
11. VideoEntryComponent
12. TagsComponent
13. TagComponent
14. MarkdownPipe
15. ToDatePipe

## ng2-gapminder components diagram 

![ng2-gapminder](ng2-gapminder.png)


## Contentful diagram
![contentful-diagram](contentful-diagram.png)

## Contentful
### Add Content model or ContentType
1. `Tag` - for create tags and add in node page, include fields:
  - `name` (`Short text`)
    Settings:
      - Check: `This field represents the Entry title`
      - Validations: `This field is required`
      - Appearance: `Slug`
  - `slug` (`Short text`)
    Settings:
      - Appearance: `Slug`
2. `Html` - model used to create the html blocks in nodePage, include fields:
  - `name` (`Short text`)
    Settings:
      - Check: `This field represents the Entry title`
      - Appearance: `Single line`
  - `content` (`Long text`)
    Settings:
      - Appearance: `Markdown`
3. `Video` - model used to create the tags to the post, is added into nodePage, include fields:
  - `title` (`Short text`)
    Settings:
      - Check: `This field represents the Entry title`
      - Appearance: `Single line`
  - `description` (`Long text`)
    Settings:
      - Appearance: `Markdown`
  - `youtube` (`Short text`)
  - `vimeo` (`Short text`)
4. `Embedded` - to create a block via `<iframe>` into nogePage, for example vizabi block or google slide, include fields: 
  - `title` (`Short text`)
    Settings:
      - Check: `This field represents the Entry title`
      - Appearance: `Single line`
  - `link` (`Long text`)
    Settings:
      - Validations: `This field is required`
      - Appearance: `Single line`
5.  `NodePage` - global page for all posts/blogs or list posts, include fields:
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
      

### Content
`Add entry` => `NodePage` and fill it, for example:

- Page test
    - `title`: Page test
    - `slug`: page-test
    - `description`: first page
    - `entries` - create new `html`
    
- Sub page
    - `title`: Sub page
    - `slug`: sub-page
    - `description`: Sub page test
    - `entries` - create new `html`
    - `Related nodes`: `Page test` 
    - `parent`: `Page test`
    - `tags`: blog



### Demo

1. `git clone git@github.com:VS-work/ng2-gapminder.git`
2. in folder `ng2-gapminder/demo` - open and edit next files:
 - `contentful.json` - add your accessToken and space
 
     ```
     Ng2ContentfulConfig.config = {
       accessToken: CONTENTFUL_ACCESS_TOKEN,
       space: CONTENTFUL_SPACE_ID,
       host: CONTENTFUL_HOST
     };
     ```
 - `app.constants.ts` update all id (keys) according to your `content model` => `JSON preview`, for example 
     ```
     {
       "name": "Node page",
       "description": "Main content type",
       "displayField": "title",
       "fields": [
         {
           "name": "title",
           "id": "title",
           "type": "Symbol",
           "localized": false,
           "validations": [],
           "required": true
         }
       ],
       [...],
       "sys": {
         "id": "***YOUR ID***",
         "type": "ContentType"
         }
       }
     }
    ```
    Get value from `sys.id` which is `***YOUR ID***` and put into app.constans.ts:
    ```
    export class ContentfulConfig {
     public static get CONTENTFUL_NODE_PAGE_TYPE_ID(): string { return ''; };
     public static get CONTENTFUL_TAG_TYPE_ID(): string { return ''; };
    
     public static get VIDEO_CONTENT_ID(): string { return ''; };
     public static get HTML_CONTENT_ID(): string { return ''; };
     public static get EMBEDDED_CONTENT_ID(): string { return ''; };
     }
    ```
3. `npm i && npm run dev`
4. `localhost:8080/#/*your slug first level*` for example `localhost:8080/#/page-test`

***Note:  all models that do not have parents - the first level
