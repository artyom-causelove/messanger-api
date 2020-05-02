import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  getImage(filename: string): string {
    let image = fs.readFileSync(`./uploads/${filename}`).toString('base64');
    const imageExtension = filename.substr(filename.indexOf('.') + 1);

    image = `data:image/${imageExtension};base64,` + image;

    return image;
  }

  async saveImage(image: string, filename: string): Promise<void> {
    fs.writeFile(
      `./uploads/${filename}`,
      image.replace(/data:image\/.+;base64,/, ''),
      'base64',
      () => console.log(`Uploaded image ${filename}`)
    );
  }

  getImageExtension(image: string): string {
    const semicolonIndex = image.indexOf(';');
    return image.substr(11, semicolonIndex - 11);
  }

  async removeImage(filename: string): Promise<void> {
    fs.unlink(`./uploads/${filename}`, () => console.log(`Unlinked image ${filename}`));
  }
}
