import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  public isMouseDown: boolean = false;
  public gradient!: CanvasGradient;
  public gradHeaderText!: CanvasGradient;
  public coords: Array<[number, number] | 'mouseup'> = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.canvas = this.canvasEl.nativeElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.draw();

    // Attach event listeners
    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    window.addEventListener('keydown', this.keyDown.bind(this)); // Attach to window
  }

  public draw(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Header
    this.context.fillStyle = "#323563";
    this.context.fillRect(0, 0, this.canvas.width, 56);

    // Header Text
    const x = this.canvas.width / 2;
    const y = 28;
    this.context.font = "24px Arial";
    this.context.textBaseline = "middle";

    this.gradHeaderText = this.context.createLinearGradient(this.canvas.width / 2 - 200, 0, this.canvas.width / 2 + 100, 56);
    this.gradHeaderText.addColorStop(0, 'white');
    this.gradHeaderText.addColorStop(0.5, 'yellow');
    this.gradHeaderText.addColorStop(1, '#1EAAF1');

    this.context.fillStyle = this.gradHeaderText;
    this.context.fillText("Test Canvas", x, y);

    // Sidebar
    this.gradient = this.context.createLinearGradient(0, (this.canvas.height - 56) / 2, 300, this.canvas.height - 56);
    this.gradient.addColorStop(0, '#1EAAF1');
    this.gradient.addColorStop(0.4, '#323563');
    this.context.fillStyle = this.gradient;
    this.context.fillRect(0, 56, 300, this.canvas.height - 56);

    // Sidebar Font
    const xFontSidebarTitle = 20;
    const yFontSidebarTitle = 126;
    this.context.font = "48px Arial";
    this.context.textBaseline = "middle";
    this.context.fillStyle = "white";
    this.context.shadowBlur = 4;
    this.context.fillText("Sidebar", xFontSidebarTitle, yFontSidebarTitle - 10);

    // Menu
    this.context.font = "24px Arial";
    this.context.fillStyle = "yellow";
    this.context.fillText("S - save", xFontSidebarTitle, yFontSidebarTitle + 60);
    this.context.fillText("C - clear", xFontSidebarTitle, yFontSidebarTitle + 120);
    this.context.fillText("R - replay", xFontSidebarTitle, yFontSidebarTitle + 180);

    // Lines
    this.context.beginPath();
    this.context.moveTo(10, 380);
    this.context.lineTo(290, 380);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(10, 150);
    this.context.lineTo(290, 150);
    this.context.stroke();

    // Main Canvas Area
    this.context.beginPath();
    this.context.fillStyle = 'white';
    this.context.fillRect(300, 56, this.canvas.width, this.canvas.height);
    this.context.lineWidth = 20;
    this.context.fillStyle = 'black';
  }

  public mouseDown(): void {
    this.isMouseDown = true;
  }

  public mouseUp(): void {
    this.isMouseDown = false;
    this.context.beginPath();
    this.coords.push('mouseup');
  }

  public mouseMove(e: MouseEvent): void {
    if (this.isMouseDown) {
      this.coords.push([e.clientX, e.clientY]);
      this.context.lineTo(e.clientX, e.clientY);
      this.context.stroke();
      this.context.beginPath();
      this.context.arc(e.clientX, e.clientY, 10, 0, Math.PI * 2);
      this.context.fill();
      this.context.beginPath();
      this.context.moveTo(e.clientX, e.clientY);
    }
  }

  public keyDown(e: KeyboardEvent): void {
    if (e.key === 's') {
      this.save();
      console.log('Save!');
    } else if (e.key === 'r') {
      console.log('Replay!');
      const savedCoords = JSON.parse(localStorage.getItem('coords') || '[]');
      this.coords = savedCoords;
      this.clear();
      this.replay();
    } else if (e.key === 'c') {
      this.clear();
      console.log('Clear!');
    }
  }

  public save(): void {
    localStorage.setItem('coords', JSON.stringify(this.coords));
  }

  public replay(): void {
    let timer = setInterval(() => {
      if (!this.coords.length) {
        clearInterval(timer);
        this.context.beginPath();
        return;
      }

      const crd = this.coords.shift();
      if (crd === 'mouseup') {
        this.context.beginPath();
      } else if (Array.isArray(crd)) {
        const [x, y] = crd;
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(x, y, 10, 0, Math.PI * 2);
        this.context.fill();
        this.context.beginPath();
        this.context.moveTo(x, y);
      }
    }, 30);
  }

  public clear(): void {
    this.context.fillStyle = 'white';
    this.context.fillRect(300, 56, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    this.context.fillStyle = 'black';
  }
}