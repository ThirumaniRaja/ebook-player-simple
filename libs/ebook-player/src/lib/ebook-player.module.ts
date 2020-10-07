import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbookPlayerComponent } from './components/ebook-player/ebook-player.component';
import { ViewPdfComponent } from './components/view-pdf/view-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfScrollDirective } from './directives/pdf-scroll.directive';
import { LibConfigModule } from 'libs/lib-config/src/lib/lib-config/lib-config.module';
import { from } from 'rxjs';
import { EbookService } from './services/ebook.service';

@NgModule({
  imports: [CommonModule,PdfViewerModule,
    LibConfigModule.forChild(EbookPlayerComponent),],
  declarations: [EbookPlayerComponent, ViewPdfComponent, PdfScrollDirective],
  exports: [EbookPlayerComponent, ViewPdfComponent, PdfScrollDirective],
  entryComponents: [EbookPlayerComponent, ViewPdfComponent],
  providers:[EbookService]
})
export class EbookPlayerModule {}
