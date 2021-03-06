// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // add your API_KEY from TMDB here
  API_KEY: '0ad37777194a640e5a300d873bdf337d',
  IMAGE_LINK: 'https://image.tmdb.org/t/p',
  MOVIES_LINK: 'https://api.themoviedb.org/3/movie',
  GENRES_LINK: 'https://api.themoviedb.org/3/genre/movie/list',
  YOUTUBE_LINK: 'https://www.youtube.com/embed/',
  FIREBASE: {
    apiKey: 'AIzaSyAhWcUjx6T2x4mNAYo5z5DsC5UHRAGPgSc',
    authDomain: 'cinema-movie-booking.firebaseapp.com',
    databaseURL: 'https://cinema-movie-booking.firebaseio.com',
    projectId: 'cinema-movie-booking',
    storageBucket: 'cinema-movie-booking.appspot.com',
    messagingSenderId: '340095530742',
    appId: '1:340095530742:web:870f1fd707ffcee186ded7',
    measurementId: 'G-1TPYQF14LK'
  },
  ADMIN_EMAIL: 'admin@cmb.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
