import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { SharedService } from '../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Person } from '../../shared/models/person.model';
import { MatDialog } from '@angular/material/dialog';
import { ReservationComponent } from '../reservation/reservation.component';
import { Image } from '../../shared/models/image.model';
import { ImageDialogComponent } from '../../shared/components/image-dialog/image-dialog.component';

@Component({
  selector: 'cmb-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  movie: Movie;
  movieStatus: string;
  isHandset$: Observable<boolean>;
  subscriptionMovieDetails: Subscription;
  fullCrew: boolean;
  fullCast: boolean;
  youtubeVideo: SafeResourceUrl;

  constructor(
    // private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    public dialog: MatDialog,
  ) {
    this.youtubeVideo = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.movie = new Movie();
    this.movieStatus = 'default';
    this.fullCrew = false;
    this.fullCast = false;
    this.isHandset$ = this.sharedService.isHandset$;
  }

  ngOnInit(): void {
    // this.changeDetectorRef.markForCheck() // -> for not having iframe flicker issue because of change detection

    // fetch data through MovieDetailsResolver
    this.route.data
      .subscribe((data: { movie: Movie }) => {
        this.youtubeVideo = this.transform(data.movie.videoYoutube.link);
        this.movie = data.movie;
      });

    // this.subscriptionMovieDetails = this.sharedService.getClickEventMovieDetails().subscribe(id => {
    //   console.log('movieID: ', id);
    // });
  }

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  sortCrew(crew: Person[]): Person[] {
    if (crew === null) {
      return [];
    }
    return crew.sort(person => person.job === 'Director' ? -1 : 1);
  }

  getDirectors(crew: Person[]): Person[] {
    if (crew === null) {
      return [];
    }
    return this.sortCrew(crew.filter(person => person.job === 'Director'));
  }

  openReservationDialog(): void {
    const dialogRef = this.dialog.open(ReservationComponent, {
      data: this.movie,
      panelClass: 'custom-modal',
      maxWidth: '90vw'
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  openImageDialog(images: Image[], imageIndex: number): void {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: {
        imageList: images,
        currentImage: imageIndex
      },
      panelClass: 'custom-image-modal',
      maxWidth: '95vw'
    });
  }

  ngOnDestroy(): void {
    // this.subscriptionMovieDetails.unsubscribe();
    // TODO: ar trebui sa dau unsubscribe la observable-urile din movieService? cu ce metoda?
  }
}
