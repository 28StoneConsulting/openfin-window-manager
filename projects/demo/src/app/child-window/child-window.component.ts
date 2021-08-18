import { Component, OnInit } from '@angular/core';
import { _Window } from 'openfin/_v2/api/window/window';

@Component({
  selector: 'app-main-window',
  templateUrl: './child-window.component.html',
  styleUrls: ['./child-window.component.scss'],
})
export class ChildWindowComponent implements OnInit {
  window: _Window;
  constructor() {}

  ngOnInit() {
    this.window = fin.Window.getCurrentSync();
    window.document.title = this.window.identity.name;
  }
}
