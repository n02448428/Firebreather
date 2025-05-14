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
import { GAME_CONFIG, COLORS } from './config.js';
var textureLoader = new THREE.TextureLoader();
var iceTexture = textureLoader.load('https://play.rosebud.ai/assets/ice.png?nKVR', function(texture) {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
});
export var Enemy = /*#__PURE__*/ function() {
    "use strict";
    function Enemy(scene, position, audioManager) {
        var scaleMultiplier = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1.0, healthMultiplier = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 1.0;
        _class_call_check(this, Enemy);
        this.scene = scene;
        this.audioManager = audioManager;
        var baseSize = THREE.MathUtils.randFloat(GAME_CONFIG.ENEMY_MIN_SIZE, GAME_CONFIG.ENEMY_MAX_SIZE);
        var scaledBaseSize = baseSize * scaleMultiplier;
        // Apply individual random variation on top of the progressive scaling
        var size = scaledBaseSize * THREE.MathUtils.randFloat(1.0, 1.5);
        this.geometry = new THREE.PlaneGeometry(size, size);
        this.uniforms = {
            uTexture: {
                value: iceTexture
            },
            uColorTint: {
                value: new THREE.Color(0xffffff)
            },
            uOpacity: {
                value: 0.9
            },
            uHealthRatio: {
                value: 1.0
            } // For shader-based damage effects if needed
        };
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: "\n                varying vec2 vUv;\n                void main() {\n                    vUv = uv;\n                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                }\n            ",
            fragmentShader: "\n                uniform sampler2D uTexture;\n                uniform vec3 uColorTint;\n                uniform float uOpacity;\n                // uniform float uHealthRatio; // Available if needed for more complex effects\n                varying vec2 vUv;\n                void main() {\n                    vec4 texColor = texture2D(uTexture, vUv);\n                    \n                    // Transparency for white background\n                    // Calculate luminance (brightness)\n                    float luma = dot(texColor.rgb, vec3(0.2126, 0.7152, 0.0722)); // Rec.709 luma coefficients\n                    float lumaThreshold = 0.90; // Slightly lower luma threshold\n                    \n                    // Check for desaturation (closeness to white/grey)\n                    float maxComp = max(texColor.r, max(texColor.g, texColor.b));\n                    float minComp = min(texColor.r, min(texColor.g, texColor.b));\n                    float saturationDiff = maxComp - minComp;\n                    float desaturationThreshold = 0.20; // Slightly increased desaturation threshold\n                    if (luma > lumaThreshold && saturationDiff < desaturationThreshold) {\n                        // Instead of discarding, make it fully transparent but allow shader to continue.\n                        // This can sometimes interact better with post-processing.\n                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n                        return;\n                    }\n                    // Apply damage tint\n                    vec3 finalColor = texColor.rgb * uColorTint;\n                    \n                    gl_FragColor = vec4(finalColor, texColor.a * uOpacity);\n                }\n            ",
            transparent: true
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(position);
        this.mesh.rotation.z = Math.random() * Math.PI * 2;
        this.scene.add(this.mesh);
        // Apply health multiplier to initial health, also factor in size.
        // Normalizing by ENEMY_MIN_SIZE ensures that the health multiplier is applied fairly regardless of base size.
        this.health = GAME_CONFIG.ENEMY_INITIAL_HEALTH * (size / GAME_CONFIG.ENEMY_MIN_SIZE) * healthMultiplier;
        this.maxHealth = this.health;
        this.speed = THREE.MathUtils.randFloat(GAME_CONFIG.ENEMY_MIN_SPEED, GAME_CONFIG.ENEMY_MAX_SPEED);
        this.spinSpeed = THREE.MathUtils.randFloat(-0.8, 0.8); // Radians per second, can be clockwise or counter-clockwise
        this.boundingRadius = size / 2;
        this.originalSize = size;
        this.isMarkedForRemoval = false;
    }
    _create_class(Enemy, [
        {
            key: "update",
            value: function update(deltaTime, targetPosition) {
                if (!this.mesh) return;
                var direction = targetPosition.clone().sub(this.mesh.position).normalize();
                this.mesh.position.addScaledVector(direction, this.speed * deltaTime);
                this.mesh.rotation.z += this.spinSpeed * deltaTime; // Apply continuous spin
            }
        },
        {
            key: "takeDamage",
            value: function takeDamage(amount) {
                if (!this.mesh) return;
                this.health -= amount;
                if (this.health <= 0) {
                    this.destroy();
                } else {
                    // Visual feedback for damage: shrink slightly and change color
                    var healthRatio = Math.max(0, this.health / this.maxHealth); // Ensure healthRatio is not negative
                    this.mesh.scale.setScalar(Math.max(0.2, healthRatio)); // Shrink
                    // Tint the texture redder as it takes damage by updating the uniform
                    var baseColor = new THREE.Color(0xffffff);
                    var damageColor = new THREE.Color(COLORS.fireEdge); // Use a thematic damage color
                    this.uniforms.uColorTint.value.lerpColors(damageColor, baseColor, healthRatio);
                    this.uniforms.uOpacity.value = THREE.MathUtils.lerp(0.5, 0.9, healthRatio); // Fade out more
                    // this.uniforms.uHealthRatio.value = healthRatio; // Update if shader uses it
                    if (this.audioManager) {
                        this.audioManager.playSound('enemy_hit', 0.7); // Increased shrink sound individual volume
                    }
                }
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                if (!this.mesh) return;
                // Could add a particle explosion effect here later
                this.scene.remove(this.mesh);
                this.geometry.dispose();
                this.material.dispose();
                this.mesh = null; // Mark as destroyed
            }
        },
        {
            key: "isDestroyed",
            value: function isDestroyed() {
                return !this.mesh;
            }
        }
    ]);
    return Enemy;
}();
