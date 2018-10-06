import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { TranslateService } from '@ngstack/translate';


@Component({
  selector: 'app-lagetypen',
  templateUrl: './lagetypen.component.html',
  styleUrls: ['./lagetypen.component.css']
})
export class LagetypenComponent implements OnInit {

  @ViewChild('drawingCanvas') canvasRef: ElementRef;

  mainAxisDegree : number = 55;
  lengthI = 0;
  lengthII = 0;
  lengthIII = 0;

  allThreePositive = false;

  offsetFoot = 0;

  lagetyp = "";

  lagetypenListe = []
  translate;

  private updateNames(){
    this.lagetypenListe = [
      {start: 0, end: 30, typ: this.translate.get("horizontalAxis")},
      {start: 30, end: 60, typ: this.translate.get("normalAxis")},
      {start: 60, end: 90, typ: this.translate.get("verticalAxis")},
      {start: 90, end: 120, typ: this.translate.get("rightAxis")},
      {start: 120, end: 270, typ: this.translate.get("extremeRight")},
      {start: 270, end: 330, typ: this.translate.get("extremeLeft")},
      {start: 330, end: 360, typ: this.translate.get("horizontalAxis")}
    ]
  }

  constructor(private ngZone: NgZone, translate: TranslateService) {
    this.translate = translate;
    this.updateNames();

    translate.activeLangChanged.subscribe(
      (event: { previousValue: string; currentValue: string }) => {
        this.updateNames();
      }
    );
   }

  ngOnInit() {
    //this.ngZone.runOutsideAngular(() => this.paint());
    this.paint();
  }

  private radians(degrees) {
    return degrees * Math.PI / 180;
  };

  private calculateProjectionSegment(referenceStart : [number, number], referenceEnd : [number, number], mainStart : [number, number], mainEnd : [number, number], horizontal = false)
  {
    // f(x) = m * x + n
    let m = (referenceEnd[1] - referenceStart[1]) / (referenceEnd[0] - referenceStart[0]);

    // n = y1 - m * x1
    let n = referenceStart[1] - m * referenceStart[0];

    // we now have the formula for the reference line
    // we now need to calculate two lines perpendicular to this line, crossing through mainStart and mainEnd
    // m' for these lines is the negative reciprocal of m

    let mPerpendicular = -(1/m);
    // f(mainEndX) = mainEndY
    // mainEndY = mPerpendicular * mainEndX + n
    // mainEndY - (mPerpendicular * mainEndX) = n
    let nPerpendicularEnd = mainEnd[1] - (mPerpendicular * mainEnd[0]);
    let nPerpendicularStart = mainStart[1] - (mPerpendicular * mainStart[0]);

    // now we need to calculate the crossing point where
    // m * x + n = mPerpendicular * x + nPerpendicular
    //(m * x) - (mPerpendicular * x) = nPerpendular - n
    // x * (m - mPerpendular) = ...
    // x = (nPerpendicular - n) / (m - mPerpendicular)

    let segmentStartX = (nPerpendicularStart - n) / (m - mPerpendicular);
    let segmentEndX =  (nPerpendicularEnd - n) / (m - mPerpendicular);

    let segmentStartY = m * segmentStartX + n;
    let segmentEndY = m * segmentEndX + n;

    if(horizontal)
    {
      // edge case: horizontal line:
      // happens for lead I
      // --> we need to calculate based on on x coordinates

      segmentStartX = mainStart[0];
      segmentStartY = referenceStart[1];

      segmentEndX = mainEnd[0];
      segmentEndY = referenceEnd[1];
    }


    return {
      segmentStartX: segmentStartX,
      segmentStartY: segmentStartY,
      segmentEndX: segmentEndX,
      segmentEndY: segmentEndY
    };

  }

  private calculateLength(x1, y1, x2, y2)
  {
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
  }

  private linearFunctionSolveForY(x, m, n)
  {
    return m * x + n;
  }

  private linearFunctionSolveForX(y, m, n)
  {
    return (y - n) / m;
  }

  private paint() {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    let centerX = this.canvasRef.nativeElement.width / 2;
    let centerY = this.canvasRef.nativeElement.height / 2;

    // Draw current range

    let arcStart, arcEnd = 0;

    for(let i = 0; i < this.lagetypenListe.length; i++)
    {
      if(this.mainAxisDegree <= this.lagetypenListe[i].end)
      {
        this.lagetyp = this.lagetypenListe[i].typ;

        arcStart = this.lagetypenListe[i].start;
        arcEnd = this.lagetypenListe[i].end;
        break;
      }
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 103, this.radians(arcStart), this.radians(arcEnd));
    ctx.lineWidth = 6;
    ctx.strokeStyle = "lightgreen"
    ctx.stroke();
    ctx.lineWidth = 1;

    // Draw Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, 2*Math.PI);
    ctx.strokeStyle = "#d2d2d2"
    ctx.stroke();


    // Draw main axis
    let offsetY = Math.cos(this.radians(360 - this.mainAxisDegree + 90)) * 100;
    let offsetX = Math.sin(this.radians(360 - this.mainAxisDegree + 90)) * 100;

    let startX = centerX - offsetX;
    let startY = centerY - offsetY;

    let endX = centerX + offsetX;
    let endY = offsetY + centerY;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#3d3d3d"
    ctx.stroke();

    ctx.fillStyle = 'orange';
    ctx.beginPath(); // Arrowheads are compliacted... Indicate end with an dot
    ctx.arc(endX, endY, 3, 0, 2 * Math.PI, true);
    ctx.fill();

    //draw einthoven
    //coordinates correspond to three electrodes
    let topLeftX = centerX - 300;
    let topLeftY = centerY - 200;

    let topRightX = centerX + 300;
    let topRightY = topLeftY;

    let bottomX = centerX + this.offsetFoot;
    let bottomY = centerY + 275;


    ctx.beginPath();
    ctx.moveTo(topLeftX, topLeftY);
    ctx.lineTo(topRightX, topRightY);
    ctx.lineTo(bottomX, bottomY);
    ctx.lineTo(topLeftX, topLeftY);
    ctx.stroke();

    // Projection on I:

    let segmentI = this.calculateProjectionSegment(
      [topLeftX, topLeftY],
      [topRightX, topRightY],
      [startX, startY],
      [endX, endY],
      true
    );

    ctx.beginPath();
    ctx.strokeStyle = "#2264F0";
    ctx.lineWidth = 4;
    ctx.moveTo(segmentI.segmentStartX, segmentI.segmentStartY);
    ctx.lineTo(segmentI.segmentEndX, segmentI.segmentEndY);
    ctx.arc(segmentI.segmentEndX, segmentI.segmentEndY, 3, 0, 2 * Math.PI, true);
    ctx.stroke();

    // Projection on II:

    let segmentII = this.calculateProjectionSegment(
      [topLeftX, topLeftY],
      [bottomX, bottomY],
      [startX, startY],
      [endX, endY]
    );

    ctx.beginPath();
    ctx.strokeStyle = "#42ADEB";
    ctx.lineWidth = 4;
    ctx.moveTo(segmentII.segmentStartX, segmentII.segmentStartY);
    ctx.lineTo(segmentII.segmentEndX, segmentII.segmentEndY);
    ctx.arc(segmentII.segmentEndX, segmentII.segmentEndY, 3, 0, 2 * Math.PI, true);
    ctx.stroke();


    // Projection on III:

    let segmentIII = this.calculateProjectionSegment(
      [topRightX, topRightY],
      [bottomX, bottomY],
      [startX, startY],
      [endX, endY]
    );

    ctx.beginPath();
    ctx.strokeStyle = "#147FBD";
    ctx.lineWidth = 4;
    ctx.moveTo(segmentIII.segmentStartX, segmentIII.segmentStartY);
    ctx.lineTo(segmentIII.segmentEndX, segmentIII.segmentEndY);
    ctx.arc(segmentIII.segmentEndX, segmentIII.segmentEndY, 3, 0, 2 * Math.PI, true);
    ctx.stroke();

    let lengthIabs = this.calculateLength(segmentI.segmentStartX, segmentI.segmentStartY, segmentI.segmentEndX, segmentI.segmentEndY);
    let lengthIIabs = this.calculateLength(segmentII.segmentStartX, segmentII.segmentStartY, segmentII.segmentEndX, segmentII.segmentEndY);
    let lengthIIIabs = this.calculateLength(segmentIII.segmentStartX, segmentIII.segmentStartY, segmentIII.segmentEndX, segmentIII.segmentEndY);

    let maxLength = Math.max(lengthIabs, lengthIIabs, lengthIIIabs);

    //scale and correct for direction
    this.lengthI = (lengthIabs / maxLength) * 100 * ((segmentI.segmentEndX - segmentI.segmentStartX) / Math.abs(segmentI.segmentEndX - segmentI.segmentStartX)); 
    this.lengthII = lengthIIabs / maxLength * 100 * ((segmentII.segmentEndY - segmentII.segmentStartY) / Math.abs(segmentII.segmentEndY - segmentII.segmentStartY));
    this.lengthIII = lengthIIIabs / maxLength * 100  * ((segmentIII.segmentEndY - segmentIII.segmentStartY) / Math.abs(segmentIII.segmentEndY - segmentIII.segmentStartY));

    this.allThreePositive = (this.lengthI > 0) && (this.lengthII > 0) && (this.lengthIII > 0);

    requestAnimationFrame(() => this.paint());
  }

  formatLabelDegree(value: number | null) {
    return value + '°';
  }

}
