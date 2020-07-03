// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // add your API_KEY from TMDB here
  API_KEY: '0ad37777194a640e5a300d873bdf337d',
  IMAGE_LINK: 'https://image.tmdb.org/t/p',
  MOVIES_LINK: 'https://api.themoviedb.org/3/movie'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
