import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { SharedService } from '../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Person } from '../../shared/models/person.model';
import { MatDialog } from '@angular/material/dialog';
import { ReservationComponent } from '../reservation/reservation.component';
import { Image } from '../../shared/models/image.model';
import { ImageDialogComponent } from '../../shared/components/image-dialog/image-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cmb-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  movie = new Movie();
  fullCrew = false;
  fullCast = false;
  isHandset = false;
  youtubeVideo: SafeResourceUrl;
  private isHandsetSubscription: Subscription;

  constructor(
    // private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private dialog: MatDialog,
  ) {
    this.youtubeVideo = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit(): void {
    // this.changeDetectorRef.markForCheck() // -> for not having iframe flicker issue because of change detection
    this.isHandsetSubscription = this.sharedService
      .isHandset()
      .subscribe((isHandset: boolean) => {
        this.isHandset = isHandset;
      });

    // fetch data through MovieDetailsResolver
    this.route.data
      .subscribe((data: { movie: Movie }) => {
        this.youtubeVideo = this.transform(data.movie.videoYoutube.link);
        this.movie = data.movie;
      });
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
    this.dialog.open(ReservationComponent, {
      data: this.movie,
      panelClass: 'custom-modal',
      maxWidth: '90vw'
    });
  }

  openImageDialog(images: Image[], imageIndex: number): void {
    this.dialog.open(ImageDialogComponent, {
      data: {
        imageList: images,
        currentImage: imageIndex
      },
      panelClass: 'custom-image-modal',
      maxWidth: '95vw'
    });
  }

  ngOnDestroy(): void {
    this.isHandsetSubscription.unsubscribe();
  }
}
