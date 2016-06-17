## Component TagsComponent
Display list tags 

### Usage
```typescript
import { TagsComponent } from 'ng2-gapminder/ng2-gapminder';
// or
import {TagsComponent} from 'ng2-gapminder/components/tags/list-tags.component';
```

### Annotations
```typescript
@Component({
  selector: 'gm-tags',
  template: require('./list-tags.html') as string,
  directives: [RouterLink, Angulartics2On],
  styles: [require('./tags.css') as string]
})
export class TagsComponent {
  @Input() private listTags: string[] = [];

}

```

### Properties

- `listTags` (`string[]`) - get list tags for current page;



## Component TagComponent
Show all posts for current test

### Usage
```typescript
import { TagComponent } from 'ng2-gapminder/ng2-gapminder';
// or
import {TagComponent} from 'ng2-gapminder/components/tags/tag.component';
```

### Annotations
```typescript
@Component({
  template: require('./tag.html') as string,
  directives: [RouterLink, Angulartics2On],
  styles: [require('./tags.styl') as string],
  pipes: [ToDatePipe]
})
export class TagComponent implements OnActivate {
  @Input()
  private tag: string;
  private listNodePage: ContentfulNodePage[];
  private contentfulContentService: ContenfulContent;
  private tagId: string;
  private router: Router;
  private routesGatewayService: RoutesGatewayService;
  private breadcrumbsService: BreadcrumbsService;
}

```

### Properties

- `tag` (`string`) - name tag;
- `tagId` (`string`) - id current tag;
- `listNodePage` (`ContentfulNodePage[]`) - get all list posts;
- `contentfulContentService` (`ContenfulContent`) - get data via contentfulContent;
- `breadcrumbsService` (`BreadcrumbsService`) - listens to change route; 
- `routesGatewayService` (`RoutesGatewayService`) - registers routes; 


### RouteConfig
```
@RouteConfig([
  {path: '/tag/:tag', component: TagComponent, name: 'TagComponent'}
])
```
