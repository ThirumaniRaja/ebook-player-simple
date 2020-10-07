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
  @Output() emitScroll = new EventEmitter();
  @Input('scrollContainerRef') set scrollContainerRef(elem: HTMLElement) {
    if (elem) {
      console.log('ScrollComponent -> @Input -> elem', elem);
      this.scrollElement = elem;
      this.scrollState = this.checkScrollBookends(
        0,
        this.scrollElement.scrollHeight - this.scrollElement.clientHeight
      );
      this.scrollElement.addEventListener('scroll', e => {
        this.scrollState = this.checkScrollBookends(
          this.scrollElement.scrollTop,
          this.scrollElement.scrollHeight - this.scrollElement.clientHeight
        );
      });
    }
  }

  @ViewChild('middleDrawer', { static: false }) middleDrawer: ElementRef;
  public toggle = {
    left: false,
    right: false
  };
  public hasChapterResources = false;
  public showThumbnails = false;
  public pdfFilePath: any;
  public selectedPage: { pageNumber: number; eventType: string };
  public pdfSource: string;
  public pdfId: string;
  public initialPage = 1;

  public showTooltip = false;
  public isKeyboardOpen = false;
  public $subs = new Subscription();
  public scrollContainerRe: HTMLElement;
  public isebookResourceOpen = false;
  public currentChapterId: any;
  playerFactory;
  @HostBinding('class') get hostClasses() {
    let classes = '';
    if (this.isebookResourceOpen) {
      classes += ' container-displayN';
    }
    return classes;
  }

  public scrollElement: HTMLElement = null;
  public intervalScroll: number;
  public scrollState: ScrollState = ScrollState.START;

  constructor(private ebookService: EbookService) {}

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

  public beginLoadingResource() {
    if (this.currentChapterId) {
    }
  }

  ngOnDestroy() {}

  public pdfRendered(customPdfEvent: {
    cssTransform: boolean;
    currentPage: number;
    source: any;
  }) {}

  public getPageData(pdf: any) {
    this.pdfId = pdf._pdfInfo.fingerprint;
  }

  public toggleBar(state: string) {
    if (state === 'left') {
      this.toggle.left = !this.toggle.left;
    } else {
      this.toggle.right = !this.toggle.right;
    }
  }

  public toggleThumbnails(event: any) {
    this.showThumbnails = true;
  }

  public triggerScroll(emittedObject: {
    eventName: string;
    type: string;
    cachedCurrentTarget: any;
  }) {
    
    if (
      emittedObject.eventName === 'click' ||
      emittedObject.eventName === 'touchstart'
    ) {
      const pdfElement =
        emittedObject.cachedCurrentTarget.parentNode.parentNode.parentNode
          .parentNode.parentNode.previousElementSibling.firstChild.firstChild;
      if (emittedObject.type === 'up') {
        pdfElement.scrollTop -= 20;
      } else {
        pdfElement.scrollTop += 20;
      }
    }
  }

  public updatePdfPage(currentPageObj: { currentPage: number }) {}

  public gotoNextChapter(event: any) {}

  public goToPage(val: string) {}

  public checkScrollBookends(currentScrollPos, scrollEndTarget) {
    console.log(
      'ScrollComponent -> checkScrollBookends -> scrollEndTarget',
      scrollEndTarget
    );
    console.log(
      'ScrollComponent -> checkScrollBookends -> currentScrollPos',
      currentScrollPos
    );
    if (currentScrollPos === 0) {
      return ScrollState.START;
    }
    if (currentScrollPos >= scrollEndTarget) {
      return ScrollState.END;
    }

    return null;
  }

  public scrollEvent(direction: string, event: Event) {
    console.log(direction, event);
    const cachedCurrentTarget = event.currentTarget;
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      this.emitScrollEvent(event, cachedCurrentTarget, direction);

      this.intervalScroll = <any>setInterval(() => {
        this.emitScrollEvent(event, cachedCurrentTarget, direction);
      }, 100);
    } else {
      clearInterval(this.intervalScroll);
      this.emitScrollEvent(event, cachedCurrentTarget, direction);
    }
  }

  public emitScrollEvent(
    event: Event,
    cachedCurrentTarget: EventTarget,
    direction: string
  ) {
    this.emitScroll.emit({
      type: direction,
      eventName: event.type,
      _event: event,
      cachedCurrentTarget: cachedCurrentTarget
    });
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
}
