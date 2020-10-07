import { async, TestBed } from '@angular/core/testing';
import { EbookPlayerModule } from './ebook-player.module';

describe('EbookPlayerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EbookPlayerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EbookPlayerModule).toBeDefined();
  });
});
