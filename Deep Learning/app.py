from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
import cv2 as cv
import time

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/", methods=["GET"])
def index_get():
    return render_template("base.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    payload = [data['data']]
    print(payload)
    print("API WORKING")
    return payload
    # Conf_threshold = 0.4
    # NMS_threshold = 0.4

    # COLORS = [(0, 255, 0), (0, 0, 255), (255, 0, 0),
    #         (255, 255, 0), (255, 0, 255), (0, 255, 255)]

    # class_name = []

    # with open('classes.txt', 'r') as f:
    #     class_name = [cname.strip() for cname in f.readlines()]

    # net = cv.dnn.readNet('yolov4-tiny.weights', 'yolov4-tiny.cfg')
    # net.setPreferableBackend(cv.dnn.DNN_BACKEND_CUDA)
    # net.setPreferableTarget(cv.dnn.DNN_TARGET_CUDA_FP16)

    # model = cv.dnn_DetectionModel(net)
    # model.setInputParams(size=(416, 416), scale=1/255, swapRB=True)

    # cap = cv.VideoCapture(0)
    # starting_time = time.time()
    # frame_counter = 0
    # while True:
    #     ret, frame = cap.read()
    #     frame_counter += 1
    #     if ret == False:
    #         break
    #     classes, scores, boxes = model.detect(frame, Conf_threshold, NMS_threshold)
    #     for (classid, score, box) in zip(classes, scores, boxes):
    #         color = COLORS[int(classid) % len(COLORS)]
    #         label = "%s : %f" % (class_name[classid], score)
    #         cv.rectangle(frame, box, color, 1)
    #         cv.putText(frame, label, (box[0], box[1]-10),
    #                 cv.FONT_HERSHEY_COMPLEX, 0.3, color, 1)
    #     endingTime = time.time() - starting_time
    #     fps = frame_counter/endingTime
    #     # print(fps)
    #     cv.putText(frame, f'FPS: {fps}', (20, 50),
    #             cv.FONT_HERSHEY_COMPLEX, 0.7, (0, 255, 0), 2)
    #     cv.imshow('frame', frame)
    #     key = cv.waitKey(1)
    #     if key == ord('q'):
    #         break
    # cap.release()
    # cv.destroyAllWindows()

if __name__ == "__main__":
    app.run(debug=True, host='10.0.2.2', port=7000)