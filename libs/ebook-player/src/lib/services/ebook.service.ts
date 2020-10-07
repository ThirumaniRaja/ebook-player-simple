import { Injectable, OnInit } from '@angular/core';
import { from, ReplaySubject } from 'rxjs';
// import {
  
//   SubjectSelectorService
// } from '@tce/core';

// import {
//   Ebook,
//   Chapter,
//   Topic,
//   Resource
// } from '../models/curriculum.interface';
import { catchError } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
//import { ResourceRequestType } from '../../../../../libs/e-book-player/src/lib/enums/resource-request-type.enum';
@Injectable()
export class EbookService {
 // private url = this.requestApiService.getUrl('getFile');
  private _pdfBuffers: { chapterId: string; pdf: ArrayBuffer }[] = [];

  private _ebooks = [];
  // private ebooks = new ReplaySubject<Ebook[]>(1);
  // public ebooks$ = this.ebooks.asObservable();

  // private _ebookSelection: Ebook;
  // private ebookSelection = new ReplaySubject<Ebook>(1);
 // public ebookSelection$ = this.ebookSelection.asObservable();
  // public _topicSelection: Topic[];
  // private _chapterSelection: Chapter;

  // private chapterSelection = new ReplaySubject<Chapter>(1);
  // public chapterSelection$ = this.chapterSelection.asObservable();

  // private chapterResources = new ReplaySubject<Resource[]>(1);
  // public chapterResources$ = this.chapterResources.asObservable();

  private pageSelection = new ReplaySubject<any>(1);
  public pageSelection$ = this.pageSelection.asObservable();

  private activePdf = new ReplaySubject<ArrayBuffer>(1);
  public activePdf$ = this.activePdf.asObservable();

  private isFetching = new ReplaySubject<boolean>(1);
  public isFetching$ = this.isFetching.asObservable();

  private chapterFetchError = new ReplaySubject<any>(1);
  public chapterFetchError$ = this.chapterFetchError.asObservable();
  currentGrade: any;
  currentSubject: any;
  constructor(
    // private requestApiService: RequestApiService,
   // private http: HttpClient,
   // private appStateStorageService: AppStateStorageService,
   // private subjectSelectorService: SubjectSelectorService
  ) {
    // this.subjectSelectorService.gradeLevelSelection$.subscribe(grade => {
    //   if (grade) {
    //     this.currentGrade = grade.id;
    //   }
    // });
    // this.subjectSelectorService.subjectSelection$.subscribe(subject => {
    //   if (subject) {
    //     this.currentSubject = subject.subjectId;
    //   }
    // });
  }
  // new code
  setResourceData(resource: any, id) {
    //console.log('TCL: EbookService -> setResourceData -> id', id);

    //console.log("TCL: EbookService -> setResourceData -> resource", resource.metaData)
    console.log(
      '(((((((((((((((((((((((((((*****************)))))))))))))))))))))))))))',
      resource
    );

    const { eBookObject } = <{ eBookObject: any }>resource.metaData;
    //console.log('ebook-_ebooks', this._ebooks);
    //const localStorageData: any = this.appStateStorageService.getAppStorageByCurrentStorageKey();
    // this.appStateStorageService
    //   .getAppStorageByCurrentStorageKey()
    //   .subscribe(data => {
    //     if (data && data['wbContent']) {
    //       const localStorageData: any = JSON.parse(data['wbContent']);
    //       if (localStorageData && localStorageData.ebooks) {
            //this.searchInLocalStorage(localStorageData, eBookObject);
          // } else {
          //   if (eBookObject) {
             // this.setEbooks([eBookObject]);

              //this.setEbookSelection(this._ebooks[0]);
             // let currentChapterData: any = eBookObject.chapters;
              //console.log('currentChapterData', currentChapterData);

            //  for (let index = 0; index < currentChapterData.length; index++) {
                //   const element = array[index];
               // if (currentChapterData[index].chapterId === id) {
                 // this.setChapterSelection(this._ebooks[0].chapters[index]);
  //               }
  //             }

  //             this.setPageSelection({
  //               pageNumber: 1,
  //               eventType: 'click'
  //             });
  //           }
  //         }
  //       }
  //     });
  // }

  //old code
  // setResourceData(resource: Resource) {
  //   const { eBookObject } = <{ eBookObject: Ebook }>resource.metaData;
  //   const localStorageData:any = this.appStateStorageService.getAppStorageByCurrentStorageKey();
  //   if (localStorageData && localStorageData.ebooks) {
  //     this.searchInLocalStorage(localStorageData, eBookObject);
  //   } else {
  //     if (eBookObject) {
  //       this.setEbooks([eBookObject]);

  //       this.setEbookSelection(this._ebooks[0]);
  //       this.setChapterSelection(this._ebooks[0].chapters[0]);
  //       this.setPageSelection({
  //         pageNumber: 1,
  //         eventType: 'click'
  //       });
  //     }
  //   }
  }

  setEbooks(ebooks: any[]) {
    this._ebooks = ebooks;
    //this.ebooks.next(this._ebooks);
  }

  setEbookSelection(ebook: any) {
    // this._ebookSelection = ebook;
    // this.ebookSelection.next(this._ebookSelection);
  }

  setChapterSelection(chapter: any) {
    // this._chapterSelection = chapter;
    // this.updatePdfBuffer(this._chapterSelection);
    // this.saveEbookStatus({ chapter: this._chapterSelection });
    // this.chapterSelection.next(this._chapterSelection);
    // this.setChapterResources(this._chapterSelection);
  }

  setPageSelection(page: { pageNumber: number; eventType: string }) {
    this.saveEbookStatus({ page: page });
    this.pageSelection.next(page);
  }

  setChapterResources(chapter: any) {
    //console.log('chapter', chapter);
   // this._topicSelection = chapter.topics;
    //console.log("TCL: setChapterResources -> _topicSelection", this._topicSelection)
    
      //console.log("TCL: setChapterResources -> chapter", chapter)
      const resources: any[] = [].concat
        .apply(
          [],
          chapter.topics.map(topic => {
            return topic.resources;
          })
        )
        .reduce((unique, o) => {
          if (!unique.some(obj => obj.resourceId === o.resourceId)) {
            unique.push(o);
          }
          return unique;
        }, []);
      //console.log("TCL: setChapterResources -> resources", resources)

      //this.chapterResources.next(resources);
    
  }
  private getChapterWideResources(): Observable<any> {
    let tqTopicIds = [];
    let tpTopicIds = [];
    const vtpTopicIdGroups = [];
    let returnValue: Observable<any> = null;
   
    return returnValue;
  }


  getPdfSource(chapter: any) {
   //let url add to avoid error
    let url = '';
    const file =
      '/' +
      chapter.encryptedFilePath +
      '/' +
      chapter.assetId +
      '/' +
      chapter.fileName;
    return url + file;
  }

  searchInLocalStorage(localStorageData, eBookObject) {
    this.setEbooks([eBookObject]);
    this._ebooks.forEach(ebook => {
      localStorageData.ebooks.forEach(ebookLocal => {
        if (ebook.bookId === ebookLocal.bookId) {
          this.setEbookSelection(ebook);

          if (ebookLocal.chapter) {
            ebook.chapters.forEach(chapter => {
              //console.log('ebookLocal.chapter', chapter);
              if (chapter.chapterId === ebookLocal.chapter) {
                this.setChapterSelection(chapter);
              }
            });
          } else {
            this.setChapterSelection(ebook.chapters[0]);
          }
          this.setPageSelection({
            pageNumber: ebookLocal.page ? ebookLocal.page : 1,
            eventType: 'click'
          });
        }
      });
    });
  }
  //new code
  saveEbookStatus(typeValue) {
    //console.log("ebook")
    // const localStorageData: any = this.appStateStorageService.getAppStorageByCurrentStorageKey();
    // this.appStateStorageService
    //   .getAppStorageByCurrentStorageKey()
    //   .subscribe(data => {
    //     if (data && data['wbContent']) {
    //       const localStorageData: any = JSON.parse(data['wbContent']);
    //       let attributes;
    //       let present = false;
    //       if (localStorageData && localStorageData.ebooks) {
    //         localStorageData.ebooks.forEach(ebook => {
    //           if (ebook.bookId === this._ebookSelection.bookId) {
    //             attributes = ebook;
    //             present = true;
    //           }
    //         });
    //       }
    //       if (!present) {
    //         attributes = {
    //           bookId: this._ebookSelection.bookId,
    //           page: null,
    //           chapter: null
    //         };
    //       }

    //       if (Object.keys(typeValue)[0] === 'chapter') {
    //         attributes.chapter = typeValue.chapter.chapterId;
    //         attributes.page = 1;
    //         // this.appStateStorageService.saveToLocalStorage({
    //         //   ebooks: [attributes]
    //         // });
    //       } else if (Object.keys(typeValue)[0] === 'page') {
    //         attributes.page = typeValue.page.pageNumber;
    //         // this.appStateStorageService.saveToLocalStorage({
    //         //   ebooks: [attributes]
    //         // });
    //       }
    //     }
    //   });
  }

  //old code
  // saveEbookStatus(typeValue) {
  //   const localStorageData:any = this.appStateStorageService.getAppStorageByCurrentStorageKey();
  //   let attributes;
  //   let present = false;
  //   if (localStorageData.ebooks) {
  //     localStorageData.ebooks.forEach(ebook => {
  //       if (ebook.bookId === this._ebookSelection.bookId) {
  //         attributes = ebook;
  //         present = true;
  //       }
  //     });
  //   }
  //   if (!present) {
  //     attributes = {
  //       bookId: this._ebookSelection.bookId,
  //       page: null,
  //       chapter: null
  //     };
  //   }

  //   if (Object.keys(typeValue)[0] === 'chapter') {
  //     attributes.chapter = typeValue.chapter.chapterId;
  //     attributes.page = 1;
  //     this.appStateStorageService.saveToLocalStorage({
  //       ebooks: [attributes]
  //     });
  //   } else if (Object.keys(typeValue)[0] === 'page') {
  //     attributes.page = typeValue.page.pageNumber;
  //     this.appStateStorageService.saveToLocalStorage({
  //       ebooks: [attributes]
  //     });
  //   }
  // }
}
