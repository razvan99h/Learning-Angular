import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image } from '../../models/image.model';

@Component({
  selector: 'cmb-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  images: Image[];
  currentImage: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { imageList: Image[], currentImage: number },
  ) {
    this.images = data.imageList;
    this.images.forEach(image => image.setImageSize('original'));
    this.currentImage = data.currentImage;
  }

  ngOnInit(): void {
  }

}
