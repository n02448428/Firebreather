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
export var AudioManager = /*#__PURE__*/ function() {
    "use strict";
    function AudioManager() {
        _class_call_check(this, AudioManager);
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.masterVolume = 0.15; // General volume control (0 to 1) - Further Lowered
    }
    _create_class(AudioManager, [
        {
            key: "loadSound",
            value: function loadSound(name, path) {
                var isLoop = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                var _this = this;
                return _async_to_generator(function() {
                    var response, arrayBuffer, audioBuffer, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!_this.audioContext) {
                                    // console.warn("AudioContext not initialized, cannot load sounds.");
                                    return [
                                        2,
                                        Promise.reject("AudioContext not initialized")
                                    ];
                                }
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    fetch(path)
                                ];
                            case 2:
                                response = _state.sent();
                                if (!response.ok) {
                                    throw new Error("HTTP error! status: ".concat(response.status, " for ").concat(path));
                                }
                                return [
                                    4,
                                    response.arrayBuffer()
                                ];
                            case 3:
                                arrayBuffer = _state.sent();
                                return [
                                    4,
                                    _this.audioContext.decodeAudioData(arrayBuffer)
                                ];
                            case 4:
                                audioBuffer = _state.sent();
                                _this.sounds[name] = {
                                    buffer: audioBuffer,
                                    loop: isLoop,
                                    sources: []
                                };
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                error = _state.sent();
                                // console.error(`AudioManager: Error loading sound "${name}" from ${path}:`, error);
                                if (name === 'fire_whoosh' || name === 'enemy_hit' || name === 'game_over') {
                                    _this.sounds[name] = {
                                        buffer: null,
                                        loop: isLoop,
                                        isPlaceholder: true,
                                        sources: []
                                    };
                                // console.warn(`AudioManager: Using placeholder for "${name}" due to loading error.`);
                                }
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "playSound",
            value: function playSound(name) {
                var volume = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1.0, offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
                if (!this.audioContext) {
                    // console.warn("AudioContext not initialized.");
                    return;
                }
                var soundData = this.sounds[name];
                if (!soundData) {
                    // console.warn(`AudioManager: Sound "${name}" not found or not loaded.`);
                    return;
                }
                if (soundData.buffer) {
                    var source = this.audioContext.createBufferSource();
                    source.buffer = soundData.buffer;
                    source.loop = soundData.loop;
                    var gainNode = this.audioContext.createGain();
                    gainNode.gain.setValueAtTime(volume * this.masterVolume, this.audioContext.currentTime);
                    source.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    source.start(0, offset);
                    if (!soundData.loop) {
                        soundData.sources.push(source);
                        source.onended = function() {
                            soundData.sources = soundData.sources.filter(function(s) {
                                return s !== source;
                            });
                        };
                    }
                } else if (soundData.isPlaceholder) {
                    this.playPlaceholderSound(name, volume);
                } else {
                // console.warn(`AudioManager: Sound "${name}" has no buffer and is not a placeholder.`);
                }
            }
        },
        {
            key: "playPlaceholderSound",
            value: function playPlaceholderSound(name) {
                var volume = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1.0;
                var gainNode = this.audioContext.createGain();
                gainNode.connect(this.audioContext.destination);
                var finalVolume = volume * this.masterVolume;
                var oscillatorType = 'sine';
                var frequency = 440;
                var duration = 0.3;
                var attackTime = 0.01;
                // let decayTime = duration - attackTime; // Not used
                if (name === 'fire_whoosh') {
                    oscillatorType = 'white-noise';
                    duration = 0.3;
                    attackTime = 0.05;
                    // decayTime = duration - attackTime;
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(finalVolume * 0.5, this.audioContext.currentTime + attackTime);
                    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
                } else if (name === 'enemy_hit') {
                    oscillatorType = 'triangle';
                    frequency = 220;
                    duration = 0.15;
                    attackTime = 0.01;
                    // decayTime = duration - attackTime;
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(finalVolume * 0.7, this.audioContext.currentTime + attackTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);
                } else if (name === 'game_over') {
                    oscillatorType = 'sawtooth';
                    frequency = 110;
                    duration = 0.8;
                    attackTime = 0.02;
                    // decayTime = duration - attackTime;
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(finalVolume * 0.6, this.audioContext.currentTime + attackTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);
                } else {
                    // console.warn(`AudioManager: No placeholder definition for "${name}"`);
                    return;
                }
                var oscillator = this.audioContext.createOscillator();
                oscillator.type = oscillatorType;
                if (oscillatorType !== 'white-noise') {
                    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                }
                oscillator.connect(gainNode);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + duration);
            // console.log(`AudioManager: Playing placeholder sound "${name}"`);
            }
        },
        {
            key: "setMasterVolume",
            value: function setMasterVolume(volume) {
                this.masterVolume = THREE.MathUtils.clamp(volume, 0, 1);
            // console.log(`AudioManager: Master volume set to ${this.masterVolume}`);
            }
        },
        {
            key: "stopAllSounds",
            value: function stopAllSounds() {
                if (!this.audioContext) return;
                for(var soundName in this.sounds){
                    var soundData = this.sounds[soundName];
                    if (soundData.sources && soundData.sources.length > 0) {
                        soundData.sources.forEach(function(source) {
                            try {
                                source.stop();
                            } catch (e) {
                            // Ignore
                            }
                        });
                        soundData.sources = [];
                    }
                }
            // console.log("AudioManager: All sounds stopped.");
            }
        }
    ]);
    return AudioManager;
}();
