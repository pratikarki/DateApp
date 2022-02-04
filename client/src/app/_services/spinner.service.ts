import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  count = 0;

  constructor(private spin$: NgxSpinnerService) { }

  start() {
    this.count++;
    this.spin$.show(undefined, {
      type: 'ball-atom',
      bdColor: 'rgba(255,255,255,0)',
      color: '#78c2ad',
      size: 'medium'
    })
  }

  stop() {
    this.count--;
    if (this.count <= 0) {
      this.count = 0;
      this.spin$.hide();
    }
  }
}
