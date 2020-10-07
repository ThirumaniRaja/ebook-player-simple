import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EbookPlayerComponent } from 'libs/ebook-player/src/lib/components/ebook-player/ebook-player.component';
import { LibConfigService } from 'libs/lib-config/src/lib/services/lib-config.service';

@Component({
  selector: 'tce-ebook-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('qb', { static: false, read: ViewContainerRef })
  qb: ViewContainerRef | undefined;

  showBtn = true;

  constructor(
    private libConfigService: LibConfigService
    ) {}


  loadPlayer() {
    if (this.qb) {
      this.qb.clear();
      this.loadEbookPlayer();
      this.showBtn = false;
    }
  }

  loadEbookPlayer() {
    this.libConfigService
      .getComponentFactory<EbookPlayerComponent>('load-player')
      .subscribe({
        next: componentFactory => {
          if (!this.qb) {
            return;
          }
          const ref = this.qb.createComponent(componentFactory);
          ref.changeDetectorRef.detectChanges();
        },
        error: err => {
          console.warn(err);
        }
      });
  }
}

