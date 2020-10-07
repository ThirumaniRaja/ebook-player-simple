import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {LibConfigModule,DynamicComponentManifest} from 'libs/lib-config/src/lib/lib-config/lib-config.module'
import {EbookPlayerModule} from 'libs/ebook-player/src/lib/ebook-player.module'
import { AppComponent } from './app.component';
import { from } from 'rxjs';

const manifests: DynamicComponentManifest[] = [
  {
    componentId: 'load-player',
    path: 'load-player', // some globally-unique identifier, used internally by the router
    loadChildren: () =>
      import('../../../../libs/ebook-player/src/lib/ebook-player.module').then(
        mod => mod.EbookPlayerModule)
  }];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    EbookPlayerModule,
    LibConfigModule.forRoot(manifests)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
