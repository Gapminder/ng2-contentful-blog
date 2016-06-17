## RoutesGatewayComponent

Validates routes and registers valid ones via RoutesGatewayService


### Usage
```typescript
import { RoutesGatewayComponent } from 'ng2-gapminder/ng2-gapminder';
// or
import { RoutesGatewayComponent } from 'ng2-gapminder/components/routesGateway/routes-gateway.component'
```

### Annotations
```typescript
@Component({})
@CanActivate(checkRoute)
export class RoutesGatewayComponent {
}
```

### RouteConfig
```
@RouteConfig([
  {path: '/', name: 'Root', component: RootDemoComponent, useAsDefault: true},
  {path: '/**', component: RoutesGatewayComponent}
])
```


## RoutesGatewayService

Validates routes and registers valid ones via RoutesGatewayService


### Usage
```typescript
import { RoutesGatewayService } from 'ng2-gapminder/ng2-gapminder';
// or
import { RoutesGatewayService } from 'ng2-gapminder/components/routesGateway/routes-gateway.service'
```




