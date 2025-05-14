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
import * as THREE from 'three';
import { Enemy } from './enemy.js';
import { GAME_CONFIG } from './config.js';
export var EnemyManager = /*#__PURE__*/ function() {
    "use strict";
    function EnemyManager(scene, audioManager) {
        _class_call_check(this, EnemyManager);
        this.scene = scene;
        this.audioManager = audioManager; // Store AudioManager
        this.enemies = [];
        // this.spawnTimer = GAME_CONFIG.ENEMY_SPAWN_INTERVAL_INITIAL; // Not needed here, timeSinceLastSpawn handles it
        this.timeSinceLastSpawn = 0;
        this.currentSpawnInterval = GAME_CONFIG.ENEMY_SPAWN_INTERVAL_INITIAL;
        this.totalTimeElapsed = 0; // Track total game time for scaling
        this.scaleMultiplier = 1.0;
        this.healthMultiplier = 1.0;
    }
    _create_class(EnemyManager, [
        {
            key: "reset",
            value: function reset() {
                for(var i = this.enemies.length - 1; i >= 0; i--){
                    this.enemies[i].destroy();
                }
                this.enemies = [];
                this.timeSinceLastSpawn = 0;
                this.currentSpawnInterval = GAME_CONFIG.ENEMY_SPAWN_INTERVAL_INITIAL;
                this.totalTimeElapsed = 0;
                this.scaleMultiplier = 1.0;
                this.healthMultiplier = 1.0;
            }
        },
        {
            key: "update",
            value: function update(deltaTime, playerPosition, onPlayerHitCallback) {
                // Only update spawn logic if deltaTime is positive (i.e., game is running)
                if (deltaTime > 0) {
                    this.totalTimeElapsed += deltaTime;
                    this.updateDifficultyMultipliers();
                    this.timeSinceLastSpawn += deltaTime;
                    if (this.timeSinceLastSpawn >= this.currentSpawnInterval) {
                        this.spawnEnemy(playerPosition);
                        this.timeSinceLastSpawn = 0;
                        this.currentSpawnInterval = Math.max(GAME_CONFIG.ENEMY_SPAWN_INTERVAL_MIN, this.currentSpawnInterval * GAME_CONFIG.ENEMY_SPAWN_INTERVAL_RAMP_FACTOR);
                    }
                }
                for(var i = this.enemies.length - 1; i >= 0; i--){
                    var enemy = this.enemies[i];
                    if (enemy.isDestroyed()) {
                        this.enemies.splice(i, 1);
                    } else {
                        enemy.update(deltaTime, playerPosition);
                        if (enemy.mesh && enemy.mesh.position.distanceTo(playerPosition) < GAME_CONFIG.PLAYER_HIT_RADIUS + enemy.boundingRadius) {
                            onPlayerHitCallback(); // Player is hit, game over
                        // Optionally destroy the enemy that hit the player
                        // enemy.destroy(); 
                        // this.enemies.splice(i, 1);
                        }
                    }
                }
            }
        },
        {
            key: "spawnEnemy",
            value: function spawnEnemy(targetPosition) {
                var halfW = window.innerWidth / 2;
                var halfH = window.innerHeight / 2;
                var margin = 50; // Spawn slightly off-screen
                var x, y;
                var edge = Math.floor(Math.random() * 4);
                switch(edge){
                    case 0:
                        x = THREE.MathUtils.randFloat(-halfW, halfW);
                        y = halfH + margin;
                        break;
                    case 1:
                        x = THREE.MathUtils.randFloat(-halfW, halfW);
                        y = -halfH - margin;
                        break;
                    case 2:
                        x = -halfW - margin;
                        y = THREE.MathUtils.randFloat(-halfH, halfH);
                        break;
                    case 3:
                    default:
                        x = halfW + margin;
                        y = THREE.MathUtils.randFloat(-halfH, halfH);
                        break;
                }
                var enemy = new Enemy(this.scene, new THREE.Vector3(x, y, 0), this.audioManager, this.scaleMultiplier, this.healthMultiplier);
                this.enemies.push(enemy);
            }
        },
        {
            key: "updateDifficultyMultipliers",
            value: function updateDifficultyMultipliers() {
                // Increase scale multiplier: Starts at 1, slowly increases.
                // Example: after 60 seconds, multiplier is 1 + (60 * 0.005) = 1.3 (30% larger)
                // Capped at a max to prevent excessively large enemies.
                this.scaleMultiplier = Math.min(GAME_CONFIG.ENEMY_MAX_SCALE_MULTIPLIER, 1.0 + this.totalTimeElapsed * GAME_CONFIG.ENEMY_SCALE_RAMP_PER_SECOND);
                // Increase health multiplier: Starts at 1, slowly increases.
                // Example: after 60 seconds, multiplier is 1 + (60 * 0.01) = 1.6 (60% more health)
                // Capped at a max.
                this.healthMultiplier = Math.min(GAME_CONFIG.ENEMY_MAX_HEALTH_MULTIPLIER, 1.0 + this.totalTimeElapsed * GAME_CONFIG.ENEMY_HEALTH_RAMP_PER_SECOND);
            }
        },
        {
            key: "getEnemies",
            value: function getEnemies() {
                return this.enemies.filter(function(e) {
                    return !e.isDestroyed();
                });
            }
        }
    ]);
    return EnemyManager;
}();
