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
import * as THREE from 'three';
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing';
import { MediaPipeController } from './mediaPipeController.js';
import { FireController } from './fireController.js';
import { EnemyManager } from './enemyManager.js';
import { AudioManager } from './AudioManager.js';
import { GAME_CONFIG, COLORS } from './config.js';
export var Game = /*#__PURE__*/ function() {
    "use strict";
    function Game(renderDiv, showTitleScreenCallback) {
        _class_call_check(this, Game);
        this.renderDiv = renderDiv;
        this.showTitleScreenCallback = showTitleScreenCallback; // To return to title screen
        this.scene = new THREE.Scene();
        // Orthographic camera for 2D overlay
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        this.camera.position.z = 10; // Look at the XY plane
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        }); // Alpha for transparency
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.clock = new THREE.Clock();
        this.composer = new EffectComposer(this.renderer);
        this.mediaPipeController = new MediaPipeController();
        this.fireController = new FireController(this.scene);
        this.audioManager = new AudioManager(); // Initialize AudioManager first
        this.enemyManager = new EnemyManager(this.scene, this.audioManager); // Pass AudioManager to EnemyManager
        this.scoreDisplay = null;
        // this.debugDisplay = null; // For MediaPipe debug info - REMOVED
        this.isInitialized = false;
        this.smoothedAimDirection = new THREE.Vector3(1, 0, 0); // Initialize with a default (right)
        this.currentNeutralRawDy = GAME_CONFIG.NEUTRAL_RAW_DY; // Default
        this.loadCalibration();
        this.resetGame();
    }
    _create_class(Game, [
        {
            key: "resetGame",
            value: function resetGame() {
                this.isGameOver = false;
                this.score = 0;
                // Clear existing entities
                if (this.fireController) this.fireController.reset();
                if (this.enemyManager) this.enemyManager.reset();
                if (this.audioManager) this.audioManager.stopAllSounds();
                this.smoothedAimDirection.set(1, 0, 0); // Reset smoothed aim to right on game reset
                // Reset camera position for a new game
                if (this.camera) {
                    this.camera.position.set(0, 0, 10); // Standard position for orthographic
                    this.camera.lookAt(0, 0, 0); // Look at origin of the 2D plane
                }
                if (this.scoreDisplay) {
                    this.updateScore(0); // Resets score to 0, effectively.
                } else {
                    this.scoreDisplay = this.createScoreDisplay(); // Create if it doesn't exist
                }
                var existingGameOverMessage = document.getElementById('gameOverMessage');
                if (existingGameOverMessage) {
                    existingGameOverMessage.remove();
                }
                this.clock.stop(); // Stop clock until game starts
            }
        },
        {
            key: "initMediaPipe",
            value: function initMediaPipe() {
                var _this = this;
                return _async_to_generator(function() {
                    var error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!!_this.mediaPipeController.isInitialized()) return [
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
                                    _this.mediaPipeController.init()
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                error = _state.sent();
                                // console.error("Game: MediaPipe initialization failed during pre-init:", error);
                                throw error;
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "init",
            value: function init() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!_this.isInitialized) {
                                    _this.setupRenderer();
                                    _this.setupScene();
                                    _this.setupPostProcessing();
                                    _this.setupEventListeners();
                                    _this.scoreDisplay = _this.createScoreDisplay();
                                    // this.debugDisplay = this.createDebugDisplay(); // REMOVED
                                    _this.loadSounds();
                                    _this.isInitialized = true;
                                }
                                _this.resetGame();
                                if (!!_this.mediaPipeController.isInitialized()) return [
                                    3,
                                    2
                                ];
                                // console.warn("Game.init: MediaPipe not yet initialized. Attempting again or waiting for pre-init.");
                                return [
                                    4,
                                    _this.mediaPipeController.init()
                                ];
                            case 1:
                                _state.sent();
                                _state.label = 2;
                            case 2:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "loadCalibration",
            value: function loadCalibration() {
                var calibratedDyString = localStorage.getItem('neutralFaceOrientationDy');
                if (calibratedDyString) {
                    var calibratedDy = parseFloat(calibratedDyString);
                    if (!isNaN(calibratedDy)) {
                        this.currentNeutralRawDy = calibratedDy;
                    // console.log(`Game: Using calibrated NEUTRAL_RAW_DY: ${this.currentNeutralRawDy}`);
                    } else {
                    // console.warn(`Game: Invalid calibrated NEUTRAL_RAW_DY found in localStorage: ${calibratedDyString}. Using default.`);
                    }
                } else {
                // console.log(`Game: No calibration data found in localStorage. Using default NEUTRAL_RAW_DY: ${this.currentNeutralRawDy}`);
                }
            }
        },
        {
            key: "loadSounds",
            value: function loadSounds() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _this.audioManager.loadSound('fire_whoosh', 'https://play.rosebud.ai/assets/short-fire-whoosh_1-317280.mp3?HT5K')
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    _this.audioManager.loadSound('enemy_hit', 'https://play.rosebud.ai/assets/wine-glass-clink-36035.mp3?IGkA')
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    4,
                                    _this.audioManager.loadSound('game_over', 'https://play.rosebud.ai/assets/080205_life-lost-game-over-89697.mp3?ZTxD')
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                // console.log("Game: Sounds registered with AudioManager.");
                })();
            }
        },
        {
            key: "setupRenderer",
            value: function setupRenderer() {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderDiv.appendChild(this.renderer.domElement);
            }
        },
        {
            key: "setupScene",
            value: function setupScene() {
                // No scene background color needed, it's transparent
                // Camera setup is now in resetGame and constructor
                // Lighting might need adjustment for 2D elements, or use MeshBasicMaterial for fire/enemies
                var ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Brighter ambient for 2D
                this.scene.add(ambientLight);
                // Directional light might be less relevant for purely 2D look, but can add subtle shading
                var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                directionalLight.position.set(0, 0, 10); // Pointing from camera
                this.scene.add(directionalLight);
            // Ground plane is removed as we are overlaying on video
            }
        },
        {
            key: "setupPostProcessing",
            value: function setupPostProcessing() {
                this.composer.addPass(new RenderPass(this.scene, this.camera));
                var bloomEffect = new BloomEffect({
                    intensity: 0.8,
                    luminanceThreshold: 0.7,
                    luminanceSmoothing: 0.1,
                    mipmapBlur: false
                });
                this.composer.addPass(new EffectPass(this.camera, bloomEffect));
            }
        },
        {
            key: "createScoreDisplay",
            value: function createScoreDisplay() {
                var scoreElement = document.getElementById('scoreDisplay');
                if (!scoreElement) {
                    scoreElement = document.createElement('div');
                    scoreElement.id = 'scoreDisplay';
                    Object.assign(scoreElement.style, {
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        color: 'white',
                        fontSize: '24px',
                        fontFamily: 'Arial, sans-serif',
                        zIndex: '900' // Below title/game over screens
                    });
                    document.body.appendChild(scoreElement);
                }
                scoreElement.textContent = 'Score: 0';
                return scoreElement;
            }
        },
        {
            key: "updateScore",
            value: function updateScore(pointsDelta) {
                if (pointsDelta === 0 && this.score === 0) {
                    this.score = 0;
                } else {
                    this.score += pointsDelta;
                }
                if (this.scoreDisplay) {
                    this.scoreDisplay.textContent = "Score: ".concat(this.score);
                }
            }
        },
        {
            // createDebugDisplay() - REMOVED
            // updateDebugDisplay() - REMOVED
            key: "setupEventListeners",
            value: function setupEventListeners() {
                window.addEventListener('resize', this.onWindowResize.bind(this), false);
            }
        },
        {
            key: "onWindowResize",
            value: function onWindowResize() {
                // For OrthographicCamera, update left/right/top/bottom and then projection matrix
                this.camera.left = window.innerWidth / -2;
                this.camera.right = window.innerWidth / 2;
                this.camera.top = window.innerHeight / 2;
                this.camera.bottom = window.innerHeight / -2;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.composer.setSize(window.innerWidth, window.innerHeight);
            }
        },
        {
            key: "start",
            value: function start() {
                this.isGameOver = false; // Ensure game is not over when starting
                if (this.scoreDisplay) this.scoreDisplay.style.display = 'block';
                this.clock.start(); // Start or resume the clock
                this.animate();
            }
        },
        {
            key: "animate",
            value: function animate() {
                var _this = this;
                if (this.isGameOver) {
                    this.clock.stop();
                    this.showGameOverMessage();
                    if (this.scoreDisplay) this.scoreDisplay.style.display = 'none';
                    return;
                }
                requestAnimationFrame(this.animate.bind(this));
                var rawDeltaTime = this.clock.getDelta();
                // Cap deltaTime to prevent issues with large time jumps (e.g., tab unfocus)
                var deltaTime = Math.min(rawDeltaTime, GAME_CONFIG.MAX_DELTA_TIME || 0.1);
                this.mediaPipeController.update();
                // this.updateDebugDisplay(); // REMOVED
                if (this.mediaPipeController.isMouthOpen()) {
                    var mouthPosNorm = this.mediaPipeController.getMouthCenterNormalized();
                    if (mouthPosNorm) {
                        // Convert normalized (0-1) MediaPipe coordinates to Three.js orthographic screen coordinates
                        // MediaPipe X: 0 (left) to 1 (right) on sensor. Video is mirrored.
                        // MediaPipe Y: 0 (top) to 1 (bottom) on sensor.
                        // Ortho X: -screenWidth/2 (left) to screenWidth/2 (right)
                        // Ortho Y: -screenHeight/2 (bottom) to screenHeight/2 (top)
                        var gameX = (1.0 - mouthPosNorm.x - 0.5) * window.innerWidth;
                        var gameY = -(mouthPosNorm.y - 0.5) * window.innerHeight;
                        var fireOrigin = new THREE.Vector3(gameX, gameY, 0);
                        var fireDirection;
                        var faceOrientationResult = this.mediaPipeController.getFaceOrientationVector();
                        // console.log("Face Orientation Result:", faceOrientationResult); // REMOVED
                        if (faceOrientationResult && faceOrientationResult.success) {
                            // MediaPipe's coordinate system:
                            // X increases from left to right of the sensor.
                            // Y increases from top to bottom of the sensor.
                            // Our video is mirrored (scaleX(-1)), so sensor-left is screen-right.
                            // Our game screen coordinates:
                            // X increases from left to right.
                            // Y increases from bottom to top.
                            // Target direction (forehead relative to chin on screen):
                            // Screen X: If forehead is to the right of chin on sensor (faceOrientationResult.rawDx > 0),
                            //           due to mirroring, it's to the left on screen. So, gameDirX is negative.
                            // Screen Y: If forehead is above chin on sensor (faceOrientationResult.rawDy < 0),
                            //           it's above on screen. So, gameDirY is positive.
                            // X-axis Aim Assist
                            var effectiveNeutralDx = 0; // Neutral for rawDx is 0 (no horizontal tilt)
                            if (faceOrientationResult.rawDx > 0) {
                                effectiveNeutralDx = -GAME_CONFIG.AIM_ASSIST_OFFSET_X;
                            } else if (faceOrientationResult.rawDx < 0) {
                                effectiveNeutralDx = GAME_CONFIG.AIM_ASSIST_OFFSET_X;
                            }
                            var gameDirX = -(faceOrientationResult.rawDx - effectiveNeutralDx) * GAME_CONFIG.AIM_SENSITIVITY_MULTIPLIER_X;
                            // Y-axis Aim Assist
                            var effectiveNeutralDy = this.currentNeutralRawDy;
                            if (faceOrientationResult.rawDy > this.currentNeutralRawDy) {
                                effectiveNeutralDy = this.currentNeutralRawDy - GAME_CONFIG.AIM_ASSIST_OFFSET_Y;
                            } else if (faceOrientationResult.rawDy < this.currentNeutralRawDy) {
                                effectiveNeutralDy = this.currentNeutralRawDy + GAME_CONFIG.AIM_ASSIST_OFFSET_Y;
                            }
                            var gameDirY = -(faceOrientationResult.rawDy - effectiveNeutralDy) * GAME_CONFIG.AIM_SENSITIVITY_MULTIPLIER_Y;
                            var rawFireDirection = new THREE.Vector3(gameDirX, gameDirY, 0);
                            var preNormalizationLengthSq = rawFireDirection.lengthSq();
                            if (preNormalizationLengthSq < 0.0001) {
                                // If raw is too small, don't drastically change smoothed direction, or use default up if smoothed is also zero.
                                if (this.smoothedAimDirection.lengthSq() < 0.0001) {
                                    rawFireDirection.set(0, 1, 0); // Default to UP if both are zero
                                } else {
                                    // Keep the current smoothed direction by setting raw to smoothed, so lerp doesn't change it.
                                    rawFireDirection.copy(this.smoothedAimDirection);
                                }
                            } else {
                                rawFireDirection.normalize();
                            }
                            // Smooth the direction
                            this.smoothedAimDirection.lerp(rawFireDirection, GAME_CONFIG.AIM_SMOOTHING_FACTOR);
                            if (this.smoothedAimDirection.lengthSq() < 0.0001) {
                                this.smoothedAimDirection.set(0, 1, 0); // Default to UP if it becomes zero
                            } else {
                                this.smoothedAimDirection.normalize(); // Normalize after lerp
                            }
                            fireDirection = this.smoothedAimDirection.clone(); // Use the smoothed direction
                        } else {
                            // If face orientation fails, continue using the last valid smoothed direction or default to UP.
                            if (this.smoothedAimDirection.lengthSq() < 0.0001) {
                                this.smoothedAimDirection.set(0, 1, 0);
                            }
                            fireDirection = this.smoothedAimDirection.clone();
                        }
                        var didEmit = this.fireController.emit(fireOrigin, fireDirection);
                        if (didEmit) {
                            this.audioManager.playSound('fire_whoosh', 0.2, 1.0); // Play at 20% volume, starting 1 second in
                        }
                    }
                }
                var playerScreenCenter = new THREE.Vector3(0, 0, 0); // Player is always at the center of the screen
                this.fireController.update(deltaTime, this.enemyManager.getEnemies(), function(enemy) {
                    _this.updateScore(GAME_CONFIG.POINTS_PER_ENEMY);
                    _this.audioManager.playSound('enemy_hit', 0.5); // Increased defeat sound individual volume
                });
                this.enemyManager.update(deltaTime, playerScreenCenter, function() {
                    if (!_this.isGameOver) {
                        _this.audioManager.playSound('game_over', 0.3); // Reduced volume
                    }
                    _this.isGameOver = true;
                });
                // this.renderer.render(this.scene, this.camera); // Replaced by composer
                this.composer.render(deltaTime);
            }
        },
        {
            key: "showGameOverMessage",
            value: function showGameOverMessage() {
                var _this = this;
                var gameOverElement = document.createElement('div');
                gameOverElement.id = 'gameOverMessage';
                Object.assign(gameOverElement.style, {
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
                    color: 'red',
                    fontFamily: 'Arial, sans-serif',
                    zIndex: '1000',
                    textAlign: 'center'
                });
                var gameOverText = document.createElement('h1');
                gameOverText.textContent = 'GAME OVER';
                Object.assign(gameOverText.style, {
                    fontSize: '64px',
                    marginBottom: '20px',
                    textShadow: '2px 2px 4px #000000'
                });
                var finalScoreText = document.createElement('p');
                finalScoreText.textContent = "Final Score: ".concat(this.score);
                Object.assign(finalScoreText.style, {
                    fontSize: '32px',
                    color: 'white',
                    marginBottom: '40px'
                });
                var playAgainButton = document.createElement('button');
                playAgainButton.textContent = 'Play Again';
                Object.assign(playAgainButton.style, {
                    padding: '15px 30px',
                    fontSize: '24px',
                    color: 'white',
                    backgroundColor: '#FF8C00',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
                    transition: 'background-color 0.3s ease'
                });
                playAgainButton.onmouseover = function() {
                    return playAgainButton.style.backgroundColor = '#FFA500';
                }; // Orange
                playAgainButton.onmouseout = function() {
                    return playAgainButton.style.backgroundColor = '#FF8C00';
                };
                playAgainButton.onclick = function() {
                    gameOverElement.remove();
                    // this.resetGame(); // Reset is now handled by main.js before init/start
                    _this.showTitleScreenCallback(); // Call the callback to show the title screen
                };
                gameOverElement.appendChild(gameOverText);
                gameOverElement.appendChild(finalScoreText);
                gameOverElement.appendChild(playAgainButton);
                document.body.appendChild(gameOverElement);
            }
        }
    ]);
    return Game;
}();
