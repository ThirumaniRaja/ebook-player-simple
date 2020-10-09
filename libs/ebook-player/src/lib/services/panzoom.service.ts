import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

interface Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

interface Point {
  x: number;
  y: number;
}

interface PointAndScale {
  point: Point;
  scale: number;
}

interface PlayerPoint {
  x: number;
  y: number;
  height: number;
  width: number;
}

@Injectable({
  providedIn: 'root'
})
export class PanZoomService {
  private currentPanZoomMatrix = new BehaviorSubject<Matrix>({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  });
  public currentPanZoomMatrix$ = this.currentPanZoomMatrix.asObservable();

  private panToPointSubject = new BehaviorSubject<Point>({
    x: 0,
    y: 0
  });
  public panToPoint$ = this.panToPointSubject.asObservable();

  private currentPlayerPointSubject = new BehaviorSubject<PlayerPoint>({
    x: 0,
    y: 0,
    height: 0,
    width: 0
  });
  public currentPlayerPoint$ = this.currentPlayerPointSubject.asObservable();

  private zoomToPointAndScaleSubject = new BehaviorSubject<PointAndScale>({
    point: {
      x: 0,
      y: 0
    },
    scale: 1
  });
  public zoomToPointAndScale$ = this.zoomToPointAndScaleSubject.asObservable();

  private currentZoomScaleSubject = new BehaviorSubject<number>(1);
  public currentZoomScale$ = this.currentZoomScaleSubject.asObservable();

  private explicitPanTimeout;
  private explicitPan = new ReplaySubject(1);
  public explicitPan$ = this.explicitPan.asObservable();

  currentOneTimeZoomPoint: Point | null;
  currentMousePosition: Point;

  setCurrentMatrix(newCTM: Matrix) {
    this.currentPanZoomMatrix.next(newCTM);
  }

  setPlayerPoint(position: PlayerPoint) {
    this.currentPlayerPointSubject.next(position);
  }

  setCurrentMousePosition(point: Point) {
    this.currentMousePosition = point;
  }

  setCurrentOneTimeZoomPoint(point: Point) {
    this.currentOneTimeZoomPoint = point;
  }

  setCurrentZoomScale(scale: number) {
    // Round for use in comparison.
    this.currentZoomScaleSubject.next(scale);
  }

  setZoomToPointAndScale(point: Point | null, newScale: number) {
    // Only set the current zoom to point when you will need to zoom.
    // This may need to compare a truncated or rounded zoom values.
    if (
      newScale.toFixed(4) !== this.currentZoomScaleSubject.getValue().toFixed(4)
    ) {
      this.setCurrentOneTimeZoomPoint(point);
    }
    this.zoomToPointAndScaleSubject.next({ point, scale: newScale });
  }

  movePlayersInRelationToZoomPoint(zoomFactor: number) {
    const { a, b, c, d, e, f } = this.currentPanZoomMatrix.getValue();
    const isZoomIn = zoomFactor > 1;
    let zoomPoint = this.currentMousePosition;
    if (this.currentOneTimeZoomPoint) {
      // Set the local Zoom Point to the current one time zoom point value,
      // then set the service currentOneTimeZoomPoint to null
      zoomPoint = this.currentOneTimeZoomPoint;
      this.currentOneTimeZoomPoint = null;
    }
    // Get the position of the player positioner in respect to the window.
    const playerReferencePoint = this.currentPlayerPointSubject.getValue();
    const playerPointY =
      playerReferencePoint.y + playerReferencePoint.height / 2;
    const playerPointX = playerReferencePoint.x;
    // Get the position of the mouse in respect to the window.
    // Get the Delta X and Delta Y for the space between Mouse and player positioner
    const mousePlayerDeltaX = zoomPoint.x - playerPointX;
    const mousePlayerDeltaY = zoomPoint.y - playerPointY;

    // Multiply the zoomFactor by the Deltas
    const factoredX = mousePlayerDeltaX * zoomFactor;
    const factoredY = mousePlayerDeltaY * zoomFactor;

    // Difference between old distance and new distance.
    // to get the vector for the player positioner shift
    const shiftXValue = Math.abs(mousePlayerDeltaX - factoredX);
    const shiftYValue = Math.abs(mousePlayerDeltaY - factoredY);

    let newX = e;
    let newY = f;
    // Get the new translation values for the X and Y.
    if (isZoomIn) {
      newX += zoomPoint.x > playerPointX ? -shiftXValue : shiftXValue;
      newY += zoomPoint.y > playerPointY ? -shiftYValue : shiftYValue;
    } else {
      newX += zoomPoint.x > playerPointX ? shiftXValue : -shiftXValue;
      newY += zoomPoint.y > playerPointY ? shiftYValue : -shiftYValue;
    }
    // Apply zoom factor to the to the zoom scales for the matrix
    const newWScale = a * zoomFactor;
    const newHScale = d * zoomFactor;

    const newMatrix = { a: newWScale, b, c, d: newHScale, e: newX, f: newY };
    this.currentPanZoomMatrix.next(newMatrix);
  }

  panCurrentMatrixBy(panByPoint: Point) {
    const { a, b, c, d, e, f } = this.currentPanZoomMatrix.getValue();
    const newMatrix = {
      a,
      b,
      c,
      d,
      e: e + panByPoint.x,
      f: f + panByPoint.y
    };
    this.currentPanZoomMatrix.next(newMatrix);
  }

  setExplicitPan() {
    clearTimeout(this.explicitPanTimeout);
    this.explicitPanTimeout = setTimeout(() => {
      this.explicitPan.next(true);
    }, 500);
  }

  panToPoint(point: Point) {
    const newPoint = {
      x: point.x,
      y: point.y
    };
    this.panToPointSubject.next(newPoint);
  }
}
