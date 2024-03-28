/**
 * Render prediction boxes
 * @param {HTMLCanvasElement} canvas canvas tag reference
 * @param {Array} boxes_data boxes array
 * @param {Array} scores_data scores array
 * @param {Array} classes_data class array
 * @param {Array[Number]} ratios boxes ratio [xRatio, yRatio]
 */
export function renderBoxes(
  canvas,
  boxes_data,
  scores_data,
  classes_data,
  ratios
) {
  const ctx = canvas.getContext("2d");
  const colors = new Colors();

  for (let i = 0; i < scores_data.length; ++i) {
    // filter based on class threshold
    const detectionClass = "chessboard";
    const color = colors.get(classes_data[i]);
    const score = (scores_data[i] * 100).toFixed(1);

    console.log("score", score);

    console.log(
      "aspect ratio: ",
      (boxes_data[2] - boxes_data[0]) / (boxes_data[3] - boxes_data[1])
    );

    if (score < 80) {
      continue;
    }

    let [y1, x1, y2, x2] = boxes_data.slice(i * 4, (i + 1) * 4);

    x1 = (x1 / 640) * canvas.width * ratios[0];
    x2 = (x2 / 640) * canvas.width * ratios[0];
    y1 = (y1 / 640) * canvas.height * ratios[1];
    y2 = (y2 / 640) * canvas.height * ratios[1];

    const width = x2 - x1;
    const height = y2 - y1;

    // draw box.
    ctx.fillStyle = Colors.hexToRgba(color, 0.2);
    ctx.fillRect(x1, y1, width, height);

    // draw border box.
    ctx.strokeStyle = color;

    ctx.lineWidth = Math.max(
      Math.min(ctx.canvas.width, ctx.canvas.height) / 200,
      2.5
    );
    ctx.strokeRect(x1, y1, width, height);

    // Draw the label background.
    ctx.fillStyle = color;

    ctx.fillRect(
      x1 - 1,
      y1, // handle overflow label box
      ctx.lineWidth,
      ctx.lineWidth
    );
  }
}

/**
 * Render prediction boxes
 * @param {HTMLCanvasElement} canvas canvas tag reference
 * @param {Array} boxes_data boxes array
 * @param {Array} scores_data scores array
 * @param {Array} classes_data class array
 * @param {Array[Number]} ratios boxes ratio [xRatio, yRatio]
 */
export function renderBoxesInverse(
  canvas,
  boxes_data,
  scores_data,
  classes_data,
  ratios
) {
  const ctx = canvas.getContext("2d");
  const colors = new Colors();

  ctx.fillStyle = "rgba(10,10,10,0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw border box.
  ctx.strokeStyle = "red";

  for (let i = 0; i < scores_data.length; ++i) {
    // filter based on class threshold

    const detectionClass = "chessboard";
    const color = colors.get(classes_data[i]);
    const score = (scores_data[i] * 100).toFixed(1);

    const aspectRatio =
      (boxes_data[2] - boxes_data[0]) / (boxes_data[3] - boxes_data[1]);
    console.log("score", score);

    if (score < 80) {
      continue;
    }

    let [y1, x1, y2, x2] = boxes_data.slice(i * 4, (i + 1) * 4);

    x1 = (x1 / 640) * canvas.width * ratios[0];
    x2 = (x2 / 640) * canvas.width * ratios[0];
    y1 = (y1 / 640) * canvas.height * ratios[1];
    y2 = (y2 / 640) * canvas.height * ratios[1];

    const width = x2 - x1;
    const height = y2 - y1;

    ctx.beginPath();
    ctx.clearRect(x1, y1, width, height);
    ctx.closePath();

    ctx.lineWidth = Math.max(
      Math.min(ctx.canvas.width, ctx.canvas.height) / 150,
      3
    );

    ctx.strokeRect(x1, y1, width, height);
  }
}

class Colors {
  // ultralytics color palette https://ultralytics.com/
  constructor() {
    this.palette = [
      "#FF3838",
      "#FF9D97",
      "#FF701F",
      "#FFB21D",
      "#CFD231",
      "#48F90A",
      "#92CC17",
      "#3DDB86",
      "#1A9334",
      "#00D4BB",
      "#2C99A8",
      "#00C2FF",
      "#344593",
      "#6473FF",
      "#0018EC",
      "#8438FF",
      "#520085",
      "#CB38FF",
      "#FF95C8",
      "#FF37C7",
    ];
    this.n = this.palette.length;
  }

  get = (i) => this.palette[Math.floor(i) % this.n];

  static hexToRgba = (hex, alpha) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${[
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ].join(", ")}, ${alpha})`
      : null;
  };
}
