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
import { Game } from './game.js';
var renderDiv = document.getElementById('renderDiv');
var gameInstance = null;
var mediaPipeInitError = null; // To store any error during initial MediaPipe setup
var initialLoadingScreen = null;
if (renderDiv) {
    renderDiv.style.position = 'relative';
    renderDiv.style.zIndex = '2';
    initialLoadingScreen = document.createElement('div');
    initialLoadingScreen.id = 'initialLoadingScreen';
    initialLoadingScreen.textContent = 'Initializing application and webcam... Please wait and allow access when prompted.';
    Object.assign(initialLoadingScreen.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '2000',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        textAlign: 'center'
    });
    document.body.appendChild(initialLoadingScreen);
}
function showTitleScreen() {
    var existingGameOverMessage = document.getElementById('gameOverMessage');
    if (existingGameOverMessage) existingGameOverMessage.remove();
    var titleScreenElement = document.createElement('div');
    titleScreenElement.id = 'titleScreen';
    Object.assign(titleScreenElement.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: '1000'
    });
    var titleText = document.createElement('h1');
    titleText.textContent = 'FIREBREATHER';
    Object.assign(titleText.style, {
        fontSize: '64px',
        color: '#FF4500',
        marginBottom: '20px',
        textShadow: '2px 2px 4px #000000'
    });
    var instructions = document.createElement('p');
    instructions.innerHTML = 'Open your mouth to breathe fire and melt the ice enemies!';
    Object.assign(instructions.style, {
        fontSize: '20px',
        marginBottom: '40px',
        textAlign: 'center',
        maxWidth: '80%'
    });
    var buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px' // Space between buttons
    });
    var startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start Game';
    Object.assign(startButton.style, {
        padding: '15px 30px',
        fontSize: '24px',
        color: 'white',
        backgroundColor: '#FF8C00',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
        transition: 'background-color 0.3s ease, opacity 0.3s ease',
        minWidth: '250px' // Ensure buttons have similar width
    });
    startButton.onmouseover = function() {
        if (!startButton.disabled) startButton.style.backgroundColor = '#FFA500';
    };
    startButton.onmouseout = function() {
        if (!startButton.disabled) startButton.style.backgroundColor = '#FF8C00';
    };
    var calibrateButton = document.createElement('button');
    calibrateButton.id = 'calibrateButton';
    calibrateButton.textContent = 'Calibrate Aim';
    Object.assign(calibrateButton.style, {
        padding: '12px 25px',
        fontSize: '20px',
        color: 'white',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease',
        minWidth: '250px' // Ensure buttons have similar width
    });
    calibrateButton.onmouseover = function() {
        return calibrateButton.style.backgroundColor = '#0056b3';
    };
    calibrateButton.onmouseout = function() {
        return calibrateButton.style.backgroundColor = '#007BFF';
    };
    calibrateButton.onclick = function() {
        // Placeholder for now, will navigate to calibration screen
        showCalibrationScreen();
    };
    var loadingMessage = document.createElement('p'); // This is for messages *after* clicking start
    loadingMessage.id = 'titleLoadingMessage';
    loadingMessage.style.marginTop = '20px';
    loadingMessage.style.fontSize = '18px';
    loadingMessage.style.display = 'none';
    if (mediaPipeInitError) {
        instructions.innerHTML = "Webcam/MediaPipe Error: ".concat(mediaPipeInitError.message, "<br>Please ensure webcam is connected, permissions are granted, and try refreshing the page.");
        instructions.style.color = 'red';
        startButton.disabled = true;
        startButton.textContent = 'Webcam Error';
        startButton.style.backgroundColor = 'grey';
        startButton.style.cursor = 'not-allowed';
        calibrateButton.style.display = 'none'; // Hide calibrate button if webcam error
    } else if (gameInstance && !gameInstance.mediaPipeController.isInitialized()) {
        // Defensive: Should not happen if await gameInstance.initMediaPipe() completed without error
        instructions.innerHTML = 'Webcam setup incomplete. Please refresh the page.';
        instructions.style.color = 'orange';
        startButton.disabled = true;
        startButton.textContent = 'Setup Incomplete';
        startButton.style.backgroundColor = 'grey';
        startButton.style.cursor = 'not-allowed';
        calibrateButton.style.display = 'none'; // Hide calibrate button if webcam error
    } else {
        // Check localStorage for calibration data
        var calibratedDy = localStorage.getItem('neutralFaceOrientationDy');
        if (!calibratedDy) {
            startButton.disabled = true;
            startButton.textContent = 'Calibrate First';
            startButton.style.backgroundColor = 'grey';
            startButton.style.cursor = 'not-allowed';
            startButton.style.opacity = '0.7';
            instructions.innerHTML += '<br><strong style="color: yellow;">Please calibrate your aim before starting!</strong>';
        }
    }
    startButton.onclick = /*#__PURE__*/ _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (startButton.disabled) return [
                        2
                    ];
                    startButton.disabled = true;
                    startButton.textContent = 'Loading Game...';
                    loadingMessage.textContent = 'Starting game...';
                    loadingMessage.style.display = 'block';
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    // gameInstance.init() is now much faster, just sets up game state
                    return [
                        4,
                        gameInstance.init()
                    ];
                case 2:
                    _state.sent(); // Calls resetGame internally
                    titleScreenElement.remove();
                    gameInstance.start();
                    return [
                        3,
                        4
                    ];
                case 3:
                    error = _state.sent();
                    // console.error("Error starting game:", error); // Keep for critical failures
                    loadingMessage.textContent = "Error starting game: ".concat(error.message, ". Please refresh.");
                    loadingMessage.style.color = 'red';
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    titleScreenElement.appendChild(titleText);
    titleScreenElement.appendChild(instructions);
    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(calibrateButton);
    titleScreenElement.appendChild(buttonContainer);
    titleScreenElement.appendChild(loadingMessage);
    document.body.appendChild(titleScreenElement);
}
function initializeApp() {
    return _initializeApp.apply(this, arguments);
}
function _initializeApp() {
    _initializeApp = _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!renderDiv) {
                        // console.error("Fatal Error: renderDiv not found in the DOM."); // Keep for critical failures
                        if (initialLoadingScreen) initialLoadingScreen.remove();
                        document.body.innerHTML = "<div style='color:red; text-align:center; padding-top: 50px; font-family: Arial, sans-serif; font-size: 18px;'>Application Error: Required element 'renderDiv' not found. Cannot start.</div>";
                        return [
                            2
                        ];
                    }
                    gameInstance = new Game(renderDiv, showTitleScreen);
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
                        gameInstance.initMediaPipe()
                    ];
                case 2:
                    _state.sent();
                    return [
                        3,
                        4
                    ];
                case 3:
                    error = _state.sent();
                    // console.error("Main: Initial MediaPipe/Webcam initialization failed:", error); // Keep for critical failures
                    mediaPipeInitError = error;
                    return [
                        3,
                        4
                    ];
                case 4:
                    if (initialLoadingScreen) {
                        initialLoadingScreen.remove();
                    }
                    showTitleScreen(); // Display title screen, which will reflect MediaPipe status
                    return [
                        2
                    ];
            }
        });
    });
    return _initializeApp.apply(this, arguments);
}
function showCalibrationScreen() {
    var existingTitleScreen = document.getElementById('titleScreen');
    if (existingTitleScreen) existingTitleScreen.style.display = 'none'; // Hide, don't remove yet
    var calibrationScreenElement = document.getElementById('calibrationScreen');
    if (calibrationScreenElement) calibrationScreenElement.remove(); // Remove if already exists
    calibrationScreenElement = document.createElement('div');
    calibrationScreenElement.id = 'calibrationScreen';
    Object.assign(calibrationScreenElement.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: '1001' // Above title, below initial loading
    });
    var calibTitle = document.createElement('h2');
    calibTitle.textContent = 'Calibrate Your Aim';
    Object.assign(calibTitle.style, {
        fontSize: '48px',
        color: '#00A0FF',
        marginBottom: '30px'
    });
    var calibInstructions = document.createElement('p');
    calibInstructions.innerHTML = 'Position your face in the center of the screen.<br>Look directly forward and hold still.';
    Object.assign(calibInstructions.style, {
        fontSize: '20px',
        marginBottom: '30px',
        textAlign: 'center'
    });
    var faceOutline = document.createElement('div');
    faceOutline.id = 'faceOutline';
    Object.assign(faceOutline.style, {
        width: '200px',
        height: '280px',
        border: '3px dashed #00A0FF',
        borderRadius: '50% / 35%',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    });
    // Placeholder for crosshair or center marker if needed later
    // const centerMarker = document.createElement('div');
    // Object.assign(centerMarker.style, { width: '10px', height: '10px', backgroundColor: 'red', borderRadius: '50%' });
    // faceOutline.appendChild(centerMarker);
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save Calibration';
    Object.assign(saveButton.style, {
        padding: '15px 30px',
        fontSize: '22px',
        color: 'white',
        backgroundColor: '#4CAF50',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '20px',
        minWidth: '220px'
    });
    saveButton.onmouseover = function() {
        return saveButton.style.backgroundColor = '#45a049';
    };
    saveButton.onmouseout = function() {
        return saveButton.style.backgroundColor = '#4CAF50';
    };
    saveButton.onclick = function() {
        if (!gameInstance || !gameInstance.mediaPipeController || !gameInstance.mediaPipeController.isInitialized()) {
            alert("Error: Webcam or face detection is not ready. Please ensure permissions are granted and try again from the title screen.");
            return;
        }
        // Ensure MediaPipeController is actively updating to get fresh data
        gameInstance.mediaPipeController.update(); // Force an update if not in game loop
        var faceOrientation = gameInstance.mediaPipeController.getFaceOrientationVector();
        if (faceOrientation && faceOrientation.success) {
            var neutralDy = faceOrientation.rawDy;
            localStorage.setItem('neutralFaceOrientationDy', neutralDy.toString());
            alert("Calibration Saved!\nYour neutral head tilt (rawDy) is: ".concat(neutralDy.toFixed(3), "\nThis will be used to aim your fire."));
            calibrationScreenElement.remove();
            if (existingTitleScreen) {
                existingTitleScreen.remove(); // Remove old title screen
                showTitleScreen(); // Re-show title screen to update button states
            } else {
                showTitleScreen(); // Fallback
            }
        } else {
            alert("Could not detect face orientation clearly. Please ensure your face is well-lit, centered, and you are looking straight ahead. Try again.");
        // console.warn("Calibration failed: No clear face orientation detected.");
        }
    };
    var backButton = document.createElement('button');
    backButton.textContent = 'Back to Title';
    Object.assign(backButton.style, {
        padding: '10px 20px',
        fontSize: '18px',
        color: 'white',
        backgroundColor: '#f44336',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        minWidth: '220px'
    });
    backButton.onmouseover = function() {
        return backButton.style.backgroundColor = '#da190b';
    };
    backButton.onmouseout = function() {
        return backButton.style.backgroundColor = '#f44336';
    };
    backButton.onclick = function() {
        calibrationScreenElement.remove();
        if (existingTitleScreen) {
            existingTitleScreen.style.display = 'flex'; // Show it again
        } else {
            showTitleScreen(); // Fallback if somehow title screen was removed entirely
        }
    };
    calibrationScreenElement.appendChild(calibTitle);
    calibrationScreenElement.appendChild(calibInstructions);
    calibrationScreenElement.appendChild(faceOutline);
    calibrationScreenElement.appendChild(saveButton);
    calibrationScreenElement.appendChild(backButton);
    document.body.appendChild(calibrationScreenElement);
}
initializeApp();
