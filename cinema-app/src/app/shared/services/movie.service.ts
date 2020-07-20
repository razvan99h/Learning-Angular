import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Movie, MoviesTMDB, MovieTMDB } from '../models/movie.model';

import { environment } from '../../../environments/environment';

import { forkJoin, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { VideosTMDB, VideoTMDB, VideoYoutube } from '../models/video.model';
import { Image, ImagesTMDB } from '../models/image.model';
import { Person, Persons, PersonsTMDB } from '../models/person.model';
import { Genre, GenresTMDB } from '../models/genre.model';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getMovie(movieID: number): Observable<Movie> {
    console.log(`getMovie <<< movieID = ${movieID}`);
    const url = environment.MOVIES_LINK + '/' + movieID + '?api_key=' + environment.API_KEY;
    return this.httpClient
      .get<MovieTMDB>(url)
      .pipe(
        map(movieTMDB => {
          const movie = new Movie(movieTMDB);
          console.log('getMovie >>> movie = ', movie);
          return movie;
        })
      );
  }

  getAllMovies(page: number = 1, maxTitleLength: number = -1): Observable<Movie[]> {
    console.log(`getAllMovies <<< page = ${page}, maxTitleLength = ${maxTitleLength}`);
    const url = environment.MOVIES_LINK + '/now_playing?page=' + page + '&api_key=' + environment.API_KEY;
    return this.httpClient
      .get<MoviesTMDB>(url)
      .pipe(
        map(moviesTMDB => {
          const movies = moviesTMDB.results.map(movieTMDB => {
            const movie = new Movie(movieTMDB);
            if (movie.title.length > maxTitleLength && maxTitleLength >= 0) {
              movie.title = movie.title.slice(0, maxTitleLength) + '...';
            }
            return movie;
          });
          console.log('getAllMovies >>> movies = ', movies);
          return movies;
        })
      );
  }

  getVideoYoutube(movieID: number): Observable<VideoYoutube> {
    console.log(`getVideoYoutube <<< movieID = ${movieID}`);
    const url = environment.MOVIES_LINK + '/' + movieID + '/videos?api_key=' + environment.API_KEY;
    return this.httpClient
      .get<VideosTMDB>(url)
      .pipe(
        map(videosTMDB => {
          let videoYoutube = new VideoYoutube();
          const videoYoutubeTMDB: VideoTMDB = videosTMDB.results.find(video => video.site === 'YouTube');
          if (videoYoutubeTMDB !== undefined) {
            videoYoutube = new VideoYoutube(videoYoutubeTMDB);
          }
          console.log('getVideoYoutube >>> videoYoutube = ', videoYoutube);
          return videoYoutube;
        })
      );
  }

  getImages(movieID: number): Observable<Image[]> {
    console.log(`getImages <<< movieID = ${movieID}`);
    const url = environment.MOVIES_LINK + '/' + movieID + '/images?api_key=' + environment.API_KEY;
    return this.httpClient
      .get<ImagesTMDB>(url)
      .pipe(
        map(imagesTMDB => {
          const images: Image[] = imagesTMDB.backdrops.map(backdropTMDB => new Image(backdropTMDB));
          console.log('getImages >>> images = ', images);
          return images;
        })
      );
  }

  getPersons(movieID: number): Observable<Persons> {
    console.log(`getPersons <<< movieID = ${movieID}`);
    const url = environment.MOVIES_LINK + '/' + movieID + '/credits?api_key=' + environment.API_KEY;
    return this.httpClient
      .get<PersonsTMDB>(url)
      .pipe(
        map(personsTMDB => {
          const persons = new Persons();
          persons.cast = personsTMDB.cast.map(personTMDB => new Person(personTMDB));
          persons.crew = personsTMDB.crew.map(personTMDB => new Person(personTMDB));
          console.log('getPersons >>> persons = ', persons);
          return persons;
        })
      );
  }

  getMovieData(movieID: number): Observable<any[]> {
    const response1 = this.getVideoYoutube(movieID);
    const response2 = this.getImages(movieID);
    const response3 = this.getPersons(movieID);
    return forkJoin([response1, response2, response3]);
  }

  getAllGenres(): Observable<Map<number, string>> {
    console.log(`getAllGenres <<<`);
    const url = environment.GENRES_LINK + '?api_key=' + environment.API_KEY;
    return this.httpClient
      .get<GenresTMDB>(url)
      .pipe(
        map(genresTMDB => {
          const genres = genresTMDB.genres
            .reduce((genreMap: Map<number, string>, genre: Genre) => {
              genreMap.set(genre.id, genre.name);
              return genreMap;
            }, new Map());
          console.log('getAllGenres >>> genres = ', genres);
          return genres;
        })
      );
  }
}

