import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {RouterLink} from '@angular/router-deprecated';

// webpack html imports
let template = require('./main-menu.html');

@Component({
  selector: 'main-menu',
  template: template,
  styles: [`
    .nav-header {
    padding: 0;
    margin: 0;
    width: 100%;
    list-style: none;
    float: left;
    }
    .nav-header li {float:left; margin: 10px}
  `],
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class MainMenuComponent {

}
