## ContenfulContent Service

### Usage
```typescript
import { ContenfulContent } from 'ng2-gapminder/ng2-gapminder';
// or
import { ContenfulContent } from 'ng2-gapminder/components/contentfulService/contentful-content.service'
```

### Annotations
```typescript
export class ContenfulContent {
  private contentfulService: ContentfulService;
  private contentfulConstantId: any;

  public constructor(contentfulService: ContentfulService,
                     @Inject('ContentfulConstantId') contentfulConstantId: any) {
    this.contentfulService = contentfulService;
    this.contentfulConstantId = contentfulConstantId;
  }
}

```

### Properties
