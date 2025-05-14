function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import { FaceLandmarker, FilesetResolver } from 'https://esm.sh/@mediapipe/tasks-vision@0.10.12';
import { GAME_CONFIG } from './config.js';
export var MediaPipeController = /*#__PURE__*/ function() {
    "use strict";
    function MediaPipeController() {
        _class_call_check(this, MediaPipeController);
        this.faceLandmarker = null;
        this.videoElement = null;
        this.lastVideoTime = -1;
        this.detections = null;
        this.mouthOpen = false;
        // this.initialized = false; // This line was a duplicate or confusing, mediaPipeInitialized is the key one.
        this.mediaPipeInitialized = false;
        this.loggedBlendshapeCategories = false; // Flag to log categories only once
    }
    _create_class(MediaPipeController, [
        {
            key: "init",
            value: function init() {
                var _this = this;
                return _async_to_generator(function() {
                    var err, filesetResolver, stream, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!_this.mediaPipeInitialized) return [
                                    3,
                                    5
                                ];
                                if (!(_this.videoElement && _this.videoElement.paused)) return [
                                    3,
                                    4
                                ];
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    _this.videoElement.play()
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                err = _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 4:
                                return [
                                    2
                                ];
                            case 5:
                                _state.trys.push([
                                    5,
                                    9,
                                    ,
                                    10
                                ]);
                                return [
                                    4,
                                    FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm")
                                ];
                            case 6:
                                filesetResolver = _state.sent();
                                return [
                                    4,
                                    FaceLandmarker.createFromOptions(filesetResolver, {
                                        baseOptions: {
                                            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                                            delegate: "GPU"
                                        },
                                        outputFaceBlendshapes: true,
                                        outputFaceLandmarks: true,
                                        outputFacialTransformationMatrixes: false,
                                        runningMode: "VIDEO",
                                        numFaces: 1
                                    })
                                ];
                            case 7:
                                _this.faceLandmarker = _state.sent();
                                _this.videoElement = document.createElement('video');
                                Object.assign(_this.videoElement.style, {
                                    position: 'fixed',
                                    top: '0',
                                    left: '0',
                                    width: '100vw',
                                    height: '100vh',
                                    objectFit: 'cover',
                                    zIndex: '1',
                                    transform: 'scaleX(-1)'
                                });
                                document.body.appendChild(_this.videoElement);
                                return [
                                    4,
                                    navigator.mediaDevices.getUserMedia({
                                        video: {
                                            width: 640,
                                            height: 480
                                        },
                                        audio: false
                                    })
                                ];
                            case 8:
                                stream = _state.sent();
                                _this.videoElement.srcObject = stream;
                                return [
                                    2,
                                    new Promise(function(resolve, reject) {
                                        _this.videoElement.onloadedmetadata = /*#__PURE__*/ _async_to_generator(function() {
                                            var err;
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        _state.trys.push([
                                                            0,
                                                            2,
                                                            ,
                                                            3
                                                        ]);
                                                        return [
                                                            4,
                                                            _this.videoElement.play()
                                                        ];
                                                    case 1:
                                                        _state.sent();
                                                        _this.mediaPipeInitialized = true;
                                                        // console.log("MediaPipeController initialized, video playing.");
                                                        resolve();
                                                        return [
                                                            3,
                                                            3
                                                        ];
                                                    case 2:
                                                        err = _state.sent();
                                                        // console.error("Error playing video stream:", err);
                                                        alert("Error starting webcam video. Please check permissions and refresh.");
                                                        reject(err);
                                                        return [
                                                            3,
                                                            3
                                                        ];
                                                    case 3:
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        });
                                        _this.videoElement.onerror = function(err) {
                                            // console.error("Video element error:", err);
                                            alert("Error with video element. Please ensure webcam is not in use by another application and refresh.");
                                            reject(err);
                                        };
                                    })
                                ];
                            case 9:
                                error = _state.sent();
                                // console.error("Error initializing MediaPipe FaceLandmarker:", error);
                                throw error;
                            case 10:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "isInitialized",
            value: function isInitialized() {
                return this.mediaPipeInitialized;
            }
        },
        {
            key: "update",
            value: function update() {
                if (!this.mediaPipeInitialized || !this.faceLandmarker || !this.videoElement || this.videoElement.paused || this.videoElement.ended) {
                    return;
                }
                // Ensure video has dimensions before trying to detect
                if (this.videoElement.videoWidth === 0 || this.videoElement.videoHeight === 0) {
                    return;
                }
                var currentTime = performance.now(); // Use this for detectForVideo
                if (this.videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && this.videoElement.currentTime !== this.lastVideoTime) {
                    this.detections = this.faceLandmarker.detectForVideo(this.videoElement, currentTime);
                    this.lastVideoTime = this.videoElement.currentTime;
                }
                this.processDetections();
            }
        },
        {
            key: "processDetections",
            value: function processDetections() {
                if (this.detections && this.detections.faceBlendshapes && this.detections.faceBlendshapes.length > 0) {
                    var blendshapeCategories = this.detections.faceBlendshapes[0].categories;
                    // Log all available blendshape categories once to help debug names
                    // if (!this.loggedBlendshapeCategories && blendshapeCategories.length > 0) { // REMOVED
                    //     console.log("Available Blendshape Categories:", blendshapeCategories.map(c => c.categoryName));
                    //     this.loggedBlendshapeCategories = true; 
                    // }
                    var mouthOpenScore = 0;
                    var possibleNames = [
                        'mouthopen',
                        'jawopen'
                    ]; // Add common variations, lowercase for case-insensitive check
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = blendshapeCategories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var category = _step.value;
                            if (possibleNames.includes(category.categoryName.toLowerCase())) {
                                mouthOpenScore = category.score;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    if (mouthOpenScore > 0) {
                        this.mouthOpen = mouthOpenScore > GAME_CONFIG.MOUTH_OPEN_THRESHOLD;
                    // Store the raw score if needed for debug display, handled in game.js
                    // this.rawMouthOpenScore = mouthOpenScore; 
                    } else {
                        this.mouthOpen = false;
                    // this.rawMouthOpenScore = 0;
                    }
                } else {
                    this.mouthOpen = false;
                // this.rawMouthOpenScore = 0;
                }
            }
        },
        {
            key: "isMouthOpen",
            value: function isMouthOpen() {
                return this.mouthOpen;
            }
        },
        {
            key: "getMouthCenterNormalized",
            value: function getMouthCenterNormalized() {
                if (this.detections && this.detections.faceLandmarks && this.detections.faceLandmarks.length > 0) {
                    var landmarks = this.detections.faceLandmarks[0];
                    // Using landmark 13 (LIP_UPPER_INNER) and 14 (LIP_LOWER_INNER)
                    // to calculate the center of the mouth opening.
                    var upperLipCenter = landmarks[13];
                    var lowerLipCenter = landmarks[14];
                    if (upperLipCenter && lowerLipCenter) {
                        return {
                            x: (upperLipCenter.x + lowerLipCenter.x) / 2,
                            y: lowerLipCenter.y
                        };
                    }
                }
                return null;
            }
        },
        {
            key: "getFaceOrientationVector",
            value: function getFaceOrientationVector() {
                if (this.detections && this.detections.faceLandmarks && this.detections.faceLandmarks.length > 0) {
                    var landmarks = this.detections.faceLandmarks[0];
                    // Use landmark 10 (top of nose bridge/forehead area) and 152 (chin tip)
                    // to determine the "up" vector of the face.
                    var foreheadPoint = landmarks[10];
                    var chinPoint = landmarks[152];
                    if (foreheadPoint && chinPoint) {
                        var dx = foreheadPoint.x - chinPoint.x;
                        var dy = foreheadPoint.y - chinPoint.y; // MediaPipe Y: 0 is top, 1 is bottom. If forehead is above chin, dy is negative.
                        // Return a structure that includes a success flag and the raw vector
                        return {
                            success: true,
                            rawDx: dx,
                            rawDy: dy // Raw MediaPipe delta Y
                        };
                    }
                }
                // Return a clear failure structure
                return {
                    success: false,
                    rawDx: 0,
                    rawDy: 0
                };
            }
        },
        {
            key: "stopVideo",
            value: function stopVideo() {
                if (this.videoElement && this.videoElement.srcObject) {
                    this.videoElement.pause();
                    var stream = this.videoElement.srcObject;
                    var tracks = stream.getTracks();
                    tracks.forEach(function(track) {
                        return track.stop();
                    });
                    this.videoElement.srcObject = null;
                    this.mediaPipeInitialized = false;
                // console.log("Video stream stopped.");
                }
            }
        }
    ]);
    return MediaPipeController;
}();
