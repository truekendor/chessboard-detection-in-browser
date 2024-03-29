# Chess board detection in browser using TensorflowJS and YOLOv8. [Live demo here](https://truekendor.github.io/chessboard-detection-in-browser/)

## Model
- Model uses [Yolov8n.pt](https://github.com/ultralytics/ultralytics) trained on a custom dataset and exported to Tensorflow Js
- The model was trained inside Google Colab.

# Preview
### input image
![preview input](https://github.com/truekendor/chessboard-detection-in-browser/blob/main/images/detection-preview-1.jpg) 

### output image
![preview output](https://github.com/truekendor/chessboard-detection-in-browser/blob/main/images/detection-preview-result-1.jpg)

# Acknowledgements
- Detection output parsed with slightly modified version of the [onnx runtime web](https://github.com/Hyuto/yolov8-onnxruntime-web)
