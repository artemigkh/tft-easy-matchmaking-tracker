import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


import {Match} from './Match/Match';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  match: Match;
  showEventHistory = false;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if ('players' in params) {
        this.match = Match.fromPlayersString(params.players);
        console.log(this.match);
      }
    });
  }
}
