import { Component, OnInit } from '@angular/core';
import { CinemaRoom } from '../../../shared/models/cinema.model';
import { SharedService } from '../../../shared/services/shared.service';
import { CinemaService } from '../../../shared/services/cinema.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cmb-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  room: CinemaRoom;

  constructor(
    private sharedService: SharedService,
    private cinemaService: CinemaService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { room: CinemaRoom }) => {
        this.room = data.room;
        console.log(this.room);
      });
  }

}
