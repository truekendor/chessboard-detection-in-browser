import { detect } from "./detection.js";

const fileInput = document.querySelector("#image-input");

const mainContainer = document.querySelector(".main-container");
const canvasContainer = document.querySelector(".canvas-container");

// container with Paste/Drop text
const infoDiv = document.querySelector(".info-div");

const canvas = document.querySelector(".main-canvas");

const loader = document.querySelector(".loader");

const detectionBoxesCanvas = document.querySelector(".detection-boxes");

canvas.width = 600;
canvas.height = 600;

const grid = document.querySelector(".chessboard");

/**
 * @type {tf.GraphModel}
 */
let detectionModel = null;

Promise.all([
  // chessboard detection model
  tf.loadGraphModel("./model_half/model.json", {
    onProgress: (fractions) => {
      console.log(`detector: ${fractions}`);
    },
  }),
]).then((result) => {
  detectionModel = result[0];
  document.body.removeChild(loader);

  const dummyInput = tf.ones(detectionModel.inputs[0].shape);
  const warmupResults = detectionModel.execute(dummyInput);

  tf.dispose([dummyInput, warmupResults]);
});

infoDiv.classList.remove("hidden");

// todo change name
async function convertFile(file) {
  const img = new Image();
  const fileReader = new FileReader();
  const c = canvas.getContext("2d");

  fileReader.readAsDataURL(file);

  await new Promise((res, rej) => {
    fileReader.onload = () => {
      img.src = fileReader.result;

      grid.classList.add("hidden");
      img.onload = () => {
        infoDiv.classList.add("hidden");

        canvasContainer.classList.add("active");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        detectionBoxesCanvas.width = img.naturalWidth;
        detectionBoxesCanvas.height = img.naturalHeight;

        c.drawImage(img, 0, 0);

        res();
      };

      img.onerror = (err) => rej(err);
    };
  });

  const { boxData, classes_data, ratios, scores_data } = await detect(
    img,
    detectionModel,
    detectionBoxesCanvas
  );

  return false;
}

// * =================
// * =================
// * EVENT LISTENERS
fileInput.addEventListener("change", async () => {
  if (fileInput.files.length === 0) return;
  await convertFile(fileInput.files[0]);
});

window.addEventListener("paste", async (e) => {
  if (e.clipboardData.files.length === 0) return;
  await convertFile(e.clipboardData.files[0]);
});

window.addEventListener("drop", async (e) => {
  e.preventDefault();
  if (!detectionModel) {
    return;
  }

  if (e.dataTransfer.files.length === 0) return false;
  await convertFile(e.dataTransfer.files[0]);

  mainContainer.classList.remove("drag-over");

  canvasContainer.classList.remove("pointer-none");
});

window.addEventListener("dragover", () => {
  if (!detectionModel) {
    return;
  }

  mainContainer.classList.add("drag-over");

  canvasContainer.classList.add("pointer-none");
});

window.addEventListener("dragleave", (e) => {
  e.preventDefault();
  if (!detectionModel) {
    return;
  }

  mainContainer.classList.remove("drag-over");
});

window.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!detectionModel) {
    return;
  }
});
