/*
import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {RouterLink, Router, RouteDefinition, Instruction} from '@angular/router-deprecated';

import {TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

let name = 'Gapminder';
// webpack html imports
let doc = require('../../components/charts/readme.md');

let allPage:Array<any> = [
  {
    heading: 'Root Demo',
    tag: 'root-demo',
    id: 'root',
    ts: require('!!prismjs?lang=typescript!./root/root-demo.ts'),
    html: require('!!prismjs?lang=markup!./root/root-demo.html')
  },
  {
    heading: 'Line Chart',
    tag: 'line-chart-demo',
    id: 'lineChart',
    ts: require('!!prismjs?lang=typescript!./charts/line-chart-demo.ts'),
    html: require('!!prismjs?lang=markup!./charts/line-chart-demo.html')
  }
];

let content:string = ``;
allPage.forEach((desc:any) => {

  content += `
      <section id="${desc.id}" style="padding-top: 50px;">
        <div class="row">
          <div class="col-md-12">
            <h4>${desc.heading}</h4>
          </div>
        </div>
        <div class="card card-block panel panel-default panel-body">

         <div class="row">
          <div *ngIf="'${desc.heading}' == 'Line Chart' || '${desc.heading}' == 'Dynamic Chart'">
            <div class="col-md-12">
              <${desc.tag}></${desc.tag}>
            </div>
          </div>
          <div *ngIf="'${desc.heading}' != 'Line Chart' && '${desc.heading}' != 'Dynamic Chart'">
            <div class="col-md-12">
              <${desc.tag}></${desc.tag}>
            </div>
          </div>
        </div>
      </div>
    </section>
      
 
  `;
});

@Component({
  selector: 'demo-section',
  template: `
  DEMO
  `,
  directives: [
    TAB_DIRECTIVES,
    CORE_DIRECTIVES]
})
export class DemoSectionComponent {

}
*/
