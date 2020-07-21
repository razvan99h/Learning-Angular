import { environment } from '../../../environments/environment';

export interface ImageTMDB {
  // tslint:disable:variable-name
  file_path: string;
  height: number;
  width: number;
  aspect_ratio: number;
}

export interface ImagesTMDB {
  backdrops: ImageTMDB[];
  posters: ImageTMDB[];
}

export class Image {
  filePath: string;
  height: number;
  width: number;
  aspectRatio: number;

  constructor(imageTMDB?: ImageTMDB, imageSize: string = 'w300') {
    if (imageSize != null) {
      this.filePath = environment.IMAGE_LINK + '/' + imageSize + imageTMDB.file_path;
      this.height = imageTMDB.height;
      this.width = imageTMDB.width;
      this.aspectRatio = imageTMDB.aspect_ratio;
    }
  }

  setImageSize(imageSize: string): void {
    const fileKey = this.filePath.slice(this.filePath.lastIndexOf('/'));
    this.filePath = environment.IMAGE_LINK + '/' + imageSize + fileKey;
  }
}
