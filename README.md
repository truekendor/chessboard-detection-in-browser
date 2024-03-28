# [Chess board detection in browser using TensorflowJS and YOLOv8](https://truekendor.github.io/chessboard-detection-in-browser/)

## Model
- Model uses [Yolov8n.pt](https://github.com/ultralytics/ultralytics) trained on a custom dataset and exported to Tensorflow Js
- The model was trained inside Google Colab.

# Preview
### input image
![preview input](https://github.com/truekendor/chessboard-detection-in-browser/blob/main/images/detection-preview.jpg) 

### output image
![preview output](https://github.com/truekendor/chessboard-detection-in-browser/blob/main/images/detection-preview-result.jpg)

# Acknowledgements
- Detection output parsed with slightly modified version of the ![onnx runtime web](https://github.com/Hyuto/yolov8-onnxruntime-web)
