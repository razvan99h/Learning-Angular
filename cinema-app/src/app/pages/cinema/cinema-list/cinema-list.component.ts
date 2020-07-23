import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCinemaComponent } from '../create-cinema/create-cinema.component';

@Component({
  selector: 'cmb-cinema-list',
  templateUrl: './cinema-list.component.html',
  styleUrls: ['./cinema-list.component.scss', '../cinema.component.scss']
})
export class CinemaListComponent implements OnInit {
  isHandset$: Observable<boolean>;

  constructor(
    private sharedService: SharedService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.isHandset$ = this.sharedService.isHandset$;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCinemaComponent, {
      panelClass: 'custom-modal',
      maxWidth: '90vw',
      autoFocus: false
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
