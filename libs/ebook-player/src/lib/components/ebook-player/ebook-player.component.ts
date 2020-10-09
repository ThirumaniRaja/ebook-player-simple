import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { ResourceType } from '../../enums/resource-type.enum';
import { ScrollState } from '../../enums/scroll.state.enum';
import paginate from 'jw-paginate';
import { EbookService } from '../../services/ebook.service';
import { Subscription } from 'rxjs';
import { PanZoomService } from '../../services/panzoom.service';

@Component({
  selector: 'ece-ebook-player',
  templateUrl: './ebook-player.component.html',
  styleUrls: ['./ebook-player.component.scss']
})
export class EbookPlayerComponent implements OnInit {

 
  public numEbookPages = [0, 1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16];
  pager: any = {};
  MAX_NUMBER_PAGES = 7;
  maxPages = this.MAX_NUMBER_PAGES;
  pages: Array<number>;
  pageSize = 1;
  changePage = new EventEmitter<any>(true);
  
  public selectedPage: { pageNumber: number; eventType: string };
  public pdfId: string;
  public initialPage = 1;

 
  public $subs = new Subscription();
  public scrollContainerRe: HTMLElement;
  public zoomValue = 100;
 

  public scrollElement: HTMLElement = null;
  public intervalScroll: number;
  public scrollState: ScrollState = ScrollState.START;

  constructor(private ebookService: EbookService,private panZoomService:PanZoomService) {}

  ngOnInit() {
    this.pages = this.numEbookPages;
    if (this.numEbookPages && this.numEbookPages.length) {
      this.setPage(this.initialPage);
    }
    this.selectedPage = { eventType: 'click', pageNumber: 1 };
    this.$subs.add(
      this.ebookService.pageSelection$.subscribe(page => {
        this.selectedPage = page;
      })
    );
  }

  public getPageData(pdf: any) {
    this.pdfId = "pdfViewer";
  }

  //pagiation
  setPage(page: number) {
    console.log(page);
    // get new pager object for specified page
    this.pager = paginate(
      this.pages.length,
      page,
      this.pageSize,
      this.maxPages
    );

    // get new page of items from items array
    const pageOfItems = this.pages.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );

    // call change page function in parent component
    this.changePage.emit(pageOfItems[0] + 1);
    this.setPageWithoutEmit(this.pager.currentPage);
    this.pageChange(page);
    console.log('page click', page);
  }

  private setPageWithoutEmit(page: number) {
    this.pager = paginate(
      this.pages.length,
      page,
      this.pageSize,
      this.maxPages
    );
    console.log('setPageWithoutEmit', this.pager);
  }

  public pageChange(pageNumber: number) {
    console.log('pageChange');
    this.ebookService.setPageSelection({
      pageNumber: pageNumber,
      eventType: 'click'
    });
  }

  dynamicZoom(value){
    if(value === 'in'){
      this.zoomValue = this.zoomValue+10;
      if(this.zoomValue <= 160){
        document.getElementById('pdfViewer').style.zoom = this.zoomValue + "%" ;
      }
    }
    else{
      if(this.zoomValue > 160)
      {
        this.zoomValue = 160;
      }
      this.zoomValue = this.zoomValue-10;
      if(this.zoomValue >= 10){
        document.getElementById('pdfViewer').style.zoom = this.zoomValue + "%" ;
      }
    }
  }
}
