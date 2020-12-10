import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  constructor() {}
  @ViewChild('canvasEl') canvasEl: ElementRef;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public isMouseDown: boolean = false;
  public gradient;
  public gradHeaderText;
  public gradMove;
  public coords = [];
  ngAfterViewInit() {
    this.canvas = this.canvasEl.nativeElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.draw();
  }
  public draw() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight; 

    // header
    this.context.fillStyle = "#323563";
    this.context.fillRect(0,0, this.canvas.width, 56)
    // font
    const x = this.canvas.width / 2;
    const y = 28;
    this.context.font = "24px Arial";
    this.context.textBaseline = "middle";

    this.gradHeaderText = this.context.createLinearGradient(this.canvas.width / 2 - 200, 0, this.canvas.width / 2 + 100, 56);

    this.gradHeaderText.addColorStop('0', 'white');
    this.gradHeaderText.addColorStop('0.50', 'yellow');
    this.gradHeaderText.addColorStop('1', '#1EAAF1');




    this.context.fillStyle = this.gradHeaderText;
    this.context.fillText("Test Canvas", x, y);

    //sidebar
    
      this.gradient = this.context.createLinearGradient(0, (this.canvas.height - 56) / 2, 300, (this.canvas.height - 56));
      this.gradient.addColorStop(0, '#1EAAF1');
      this.gradient.addColorStop(.4, '#323563');
      this.context.fillStyle = this.gradient;
      this.context.fillRect(0,56, 300, this.canvas.height - 56)

    //sidebar font

    const xFontSidebarTitle = 20;
    const yFontSidebarTitle = 126;
    this.context.font = "48px Arial";
    this.context.textBaseline = "middle";
    this.context.fillStyle = "white";
    this.context.shadowBlur = 4;
    this.context.fillText("Sidebar", xFontSidebarTitle, yFontSidebarTitle - 10);

    //Menu
    this.context.font = "24px Arial";
    this.context.fillStyle = "yellow";
    this.context.fillText("S - save", xFontSidebarTitle, yFontSidebarTitle + 60);
    this.context.fillText("C - clear", xFontSidebarTitle, yFontSidebarTitle + 120);
    this.context.fillText("R - record", xFontSidebarTitle, yFontSidebarTitle + 180);
    

    this.context.beginPath();       
    this.context.moveTo(10, 380);   
    this.context.lineTo(290, 380);  
    this.context.stroke();          

    this.context.beginPath();       
    this.context.moveTo(10, 150);   
    this.context.lineTo(290, 150);  
    this.context.stroke(); 

    this.context.beginPath();     
    this.context.fillStyle = 'white';
    this.context.fillRect(300, 56, this.canvas.width, this.canvas.height);
    this.context.lineWidth = 20;   
    this.context.fillStyle = 'black';

    
    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this.canvas.addEventListener('mouseup', 
    this.mouseUp.bind(this)
    
    );
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    this.canvas.addEventListener('keydown', this.keyDown.bind(this));

  }
  public mouseDown() {
    this.isMouseDown = true;
  }
  public mouseUp() {
    this.isMouseDown = false;
    this.context.beginPath();
    this.coords.push('mouseup');
  }
  public mouseMove(e) {
    if(this.isMouseDown) {
      this.coords.push([e.clientX, e.clientY])
      this.context.lineTo(e.clientX, e.clientY);
      this.context.stroke();
      this.context.beginPath();
      this.context.arc(e.clientX, e.clientY, 10, 0, Math.PI * 2);
      this.context.fill();
      this.context.beginPath();
      this.context.moveTo(e.clientX, e.clientY)
      
    }
  }
  public keyDown(e) {
    if( e.keyCode == 83) {
      this.save();
      console.log('Save!');
    }
    if( e.keyCode == 82) {
      console.log('Replay!');
      debugger
      this.coords = JSON.parse(localStorage.getItem('coords'))
      this.clear();
      this.replay();
    }
    if( e.keyCode == 67) {
      
      this.clear(); //save
      console.log('Clear!');
    }
  }
  public save() {
    debugger;
    localStorage.setItem('coords', JSON.stringify(this.coords));
  }
  public replay() {
    let timer = setInterval(function () {
      debugger;
      if(!this.coords.length) {
        clearInterval(timer);
        this.context.beginPath();
        return;
      }
      let crd = this.coords.shift(),
      e = {
        clientX: crd["0"],
        clientY: crd["1"],
      }
      this.coords.push([e.clientX, e.clientY])
      this.context.lineTo(e.clientX, e.clientY);
      this.context.stroke();
      this.context.beginPath();
      this.context.arc(e.clientX, e.clientY, 10, 0, Math.PI * 2);
      this.context.fill();
      this.context.beginPath();
      this.context.moveTo(e.clientX, e.clientY)
    }, 30)
  }
  public clear() {
    this.context.fillStyle = 'white';
    this.context.fillRect(300, 56, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.fillStyle = 'red'
  }

}
