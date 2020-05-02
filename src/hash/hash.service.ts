import { Injectable } from '@nestjs/common';

import * as md5 from 'md5';

@Injectable()
export class HashService {

  getRandomHash(): string {
    return md5(Date.now());
  }

}
