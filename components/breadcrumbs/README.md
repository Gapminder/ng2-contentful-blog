## Component BreadcrumbsComponent

### Usage
```typescript
import { BreadcrumbsComponent } from 'ng2-gapminder/ng2-gapminder';
// or
import { BreadcrumbsComponent } from 'ng2-gapminder/components/breadcrumbs/breadcrumbs.component'
```

### Annotations
```typescript
@Component({
  selector: 'gm-breadcrumbs',
  template: require('./breadcrumbs.html') as string,
  styles: [require('./breadcrumbs.styl') as string],
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, RouterLink, Angulartics2On]
})
export class BreadcrumbsComponent implements OnInit {
  public type: string = 'Breadcrumbs Component';

  private router: Router;
  private routeDefinition: RouteDefinition[];
  private rootComponent: Type;
  private breadcrumbsService: BreadcrumbsService;
  private routesGatewayService: RoutesGatewayService;
  private isOnRootView: boolean;
  private urls: string[] = [];
  private breadcrumbFragmentName: string;
}

```

### Properties

- `rootComponent` (`Type`) - get root component, you need `  provide('RootComponent', {useValue: DemoComponent})` in bootstrap;
- `routesGatewayService` (`RoutesGatewayService`) - need for registration routes;
- `isOnRootView` (`boolean`) - root component or not;
- `urls` (`string[]`) - all possible urls;
- `breadcrumbFragmentName` (`srting`) - name current page, get from the `BreadcrumbService`; 

##  BreadcrumbsService

### Usage
```typescript
import { BreadcrumbsService } from 'ng2-gapminder/ng2-gapminder';
// or
import { BreadcrumbsService } from 'ng2-gapminder/components/breadcrumbs/breadcrumbs.component'
```


### Event
- `breadcrumbs$` (`Subject<BreadcrumbsEvent>`) - receives/transmits name anu url current page ( example `breadcrumbs$.next({url: '/', name: 'Home'})`)
