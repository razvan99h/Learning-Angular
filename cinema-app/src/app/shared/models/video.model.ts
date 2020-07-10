import { environment } from '../../../environments/environment';

export interface VideoTMDB {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface VideosTMDB {
  results: VideoTMDB[];
}

export class VideoYoutube {
  id: string;
  name: string;
  link: string;

  constructor(videoTMDB?: VideoTMDB) {
    if (videoTMDB != null) {
      this.id = videoTMDB.id;
      this.name = videoTMDB.name;
      this.link = environment.YOUTUBE_LINK + videoTMDB.key;
    } else {
      this.id = 'rickroll';
      this.name = 'Got RickRolled boi';
      this.link = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    }
  }
}
