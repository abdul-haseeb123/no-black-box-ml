class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
        background-color:white;
        box-shadow: 0px 0px 10px 2px black;    
    `;
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.paths = [];
    this.isDrawing = false;

    const lineBreak = document.createElement("br");
    container.appendChild(lineBreak);
    this.undoButton = document.createElement("button");
    this.undoButton.innerHTML = "Undo";
    this.undoButton.disabled = true;
    this.undoButton.style = `
        margin-top: 10px;
        `;
    container.appendChild(this.undoButton);

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.onmousedown = (event) => {
      const mouse = this.#getMouse(event);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };

    this.canvas.onmousemove = (event) => {
      if (this.isDrawing) {
        const mouse = this.#getMouse(event);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#redraw();
      }
    };

    this.canvas.onmouseup = () => {
      this.isDrawing = false;
    };

    this.canvas.ontouchstart = (event) => {
      const loc = event.touches[0];
      this.canvas.onmousedown(loc);
    };

    this.canvas.ontouchmove = (event) => {
      const loc = event.touches[0];
      this.canvas.onmousemove(loc);
    };

    this.canvas.ontouchend = () => {
      this.canvas.onmouseup();
    };

    this.undoButton.onclick = () => {
      this.paths.pop();
      this.#redraw();
    };
  }

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);

    if (this.paths.length === 0) {
      this.undoButton.disabled = true;
    } else {
      this.undoButton.disabled = false;
    }
  }

  #getMouse(event) {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(event.clientX - rect.left),
      Math.round(event.clientY - rect.top),
    ];
  }
}
