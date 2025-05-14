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
var FireParticle = /*#__PURE__*/ function() {
    "use strict";
    function FireParticle(scene, origin, direction) {
        _class_call_check(this, FireParticle);
        this.scene = scene;
        this.geometry = new THREE.PlaneGeometry(GAME_CONFIG.FIRE_PARTICLE_SIZE, GAME_CONFIG.FIRE_PARTICLE_SIZE);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {
                    value: 0.0
                },
                uColorCore: {
                    value: new THREE.Color(COLORS.fireCore)
                },
                uColorMid: {
                    value: new THREE.Color(COLORS.fireMid)
                },
                uColorEdge: {
                    value: new THREE.Color(COLORS.fireEdge)
                },
                uAlphaFade: {
                    value: 1.0
                },
                uScale: {
                    value: 1.0
                } // Uniform for scaling
            },
            vertexShader: "\n                varying vec2 vUv;\n                uniform float uTime;\n                uniform float uScale; // Use uScale uniform\n                void main() {\n                    vUv = uv;\n                    // Billboarding: Make planes always face the camera\n                    vec4 mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0); // Particle center in view space\n                    mvPosition.xy += position.xy * uScale; // Apply scale to vertex positions\n                    gl_Position = projectionMatrix * mvPosition;\n                }\n            ",
            fragmentShader: "\n                varying vec2 vUv;\n                uniform vec3 uColorCore;\n                uniform vec3 uColorMid;\n                uniform vec3 uColorEdge;\n                uniform float uAlphaFade;\n                uniform float uTime;\n                // 2D Simplex Noise (common GLSL implementation)\n                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\n                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }\n                float snoise(vec2 v) {\n                    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                                       -0.577350269189626,  // -1.0 + 2.0 * C.x\n                                        0.024390243902439); // 1.0 / 41.0\n                    vec2 i  = floor(v + dot(v, C.yy) );\n                    vec2 x0 = v -   i + dot(i, C.xx);\n                    vec2 i1;\n                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n                    vec4 x12 = x0.xyxy + C.xxzz;\n                    x12.xy -= i1;\n                    i = mod289(i);\n                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n                        + i.x + vec3(0.0, i1.x, 1.0 ));\n                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n                    m = m*m ;\n                    m = m*m ;\n                    vec3 x = 2.0 * fract(p * C.www) - 1.0;\n                    vec3 h = abs(x) - 0.5;\n                    vec3 ox = floor(x + 0.5);\n                    vec3 a0 = x - ox;\n                    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n                    vec3 g;\n                    g.x  = a0.x  * x0.x  + h.x  * x0.y;\n                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n                    return 130.0 * dot(m, g);\n                }\n                void main() {\n                    vec2 centeredUv = vUv - 0.5;\n                    float baseDist = length(centeredUv);\n                    // Noise parameters for main shape\n                    float mainNoiseFreq = 3.5;\n                    float mainNoiseAmp = 0.25;\n                    float mainNoiseSpeed = 0.9;\n                    float mainNoise = snoise(centeredUv * mainNoiseFreq + uTime * mainNoiseSpeed);\n                    // Noise parameters for flicker detail\n                    float flickerNoiseFreq = 8.0;\n                    float flickerNoiseAmp = 0.1;\n                    float flickerNoiseSpeed = 2.5;\n                    float flickerNoise = snoise(centeredUv * flickerNoiseFreq - uTime * flickerNoiseSpeed * (0.8 + centeredUv.y * 0.4) ); // More flicker upwards\n                    // Distort base distance with noise, encourage upward elongation\n                    // Make distortion stronger based on vertical position (less distortion at base)\n                    float verticalBias = 1.0 - (centeredUv.y + 0.5) * 0.5; // Stronger effect for upper part of particle\n                    float distortedDist = baseDist - (mainNoise * mainNoiseAmp * verticalBias) - (flickerNoise * flickerNoiseAmp * 0.5);\n                    // Color mixing: Core -> Mid -> Edge\n                    vec3 color = uColorEdge; // Start with edge color\n                    // Mix in mid color. Make it appear closer to the center.\n                    // The range for smoothstep (e.g., 0.35 to 0.15) means mid color is dominant in this band.\n                    color = mix(color, uColorMid, smoothstep(0.35, 0.15, distortedDist));\n                    // Mix in core color for the very center.\n                    // The range (e.g., 0.18 to 0.0) means core color is dominant in the very center.\n                    color = mix(color, uColorCore, smoothstep(0.18, 0.0, distortedDist));\n                    // Alpha: Softer edges, more flame-like shape\n                    // Base alpha from distorted distance, creating the main flame shape\n                    float alpha = 1.0 - smoothstep(0.3, 0.5, distortedDist);\n                    // Enhance alpha with flicker noise, making edges more wispy\n                    alpha *= (0.6 + 0.4 * (snoise(centeredUv * 5.0 + uTime * 3.0) * 0.5 + 0.5) );\n                    // Ensure the core is not too transparent if it's small\n                    alpha = max(alpha, (1.0 - smoothstep(0.0, 0.1, distortedDist)) * 0.5);\n                    // Apply overall lifetime fade\n                    alpha *= uAlphaFade;\n                    // Clamp alpha to valid range\n                    alpha = clamp(alpha, 0.0, 1.0);\n                    gl_FragColor = vec4(color, alpha);\n                }\n            ",
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false // Important for correct alpha blending of multiple particles
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(origin);
        this.scene.add(this.mesh);
        this.velocity = direction.clone().normalize().multiplyScalar(GAME_CONFIG.FIRE_PARTICLE_SPEED);
        this.lifetime = GAME_CONFIG.FIRE_PARTICLE_LIFETIME;
        this.age = 0;
    }
    _create_class(FireParticle, [
        {
            // getRandomFireColor() is no longer needed as colors are handled by the shader's uniforms
            key: "update",
            value: function update(deltaTime) {
                this.mesh.position.addScaledVector(this.velocity, deltaTime);
                this.age += deltaTime;
                this.material.uniforms.uTime.value = this.age; // Pass age for potential shader animations
                // Fade out effect controlled by uAlphaFade uniform
                var lifeRatio = this.age / this.lifetime;
                this.material.uniforms.uAlphaFade.value = 1.0 - THREE.MathUtils.smoothstep(lifeRatio, 0.0, 1.0);
                // Scale up effect: start at 1.0, grow to e.g., 1.5x or 2x towards end of life
                var startScale = 0.5;
                var endScale = 5.0; // Particle grows to 1.8 times its initial size
                this.material.uniforms.uScale.value = THREE.MathUtils.lerp(startScale, endScale, lifeRatio);
                return this.age >= this.lifetime; // True if dead
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                if (this.mesh) {
                    this.scene.remove(this.mesh);
                    this.mesh = null; // Clear reference
                }
                // Geometry and material are shared if we move to InstancedMesh later,
                // but for individual meshes, they can be disposed.
                // For now, assume they are unique per particle for simplicity.
                this.geometry.dispose();
                this.material.dispose();
            }
        }
    ]);
    return FireParticle;
}();
export var FireController = /*#__PURE__*/ function() {
    "use strict";
    function FireController(scene) {
        _class_call_check(this, FireController);
        this.scene = scene;
        this.particles = [];
        this.fireCooldown = 0;
        this.maxParticles = 200; // Limit max particles for performance
    }
    _create_class(FireController, [
        {
            key: "reset",
            value: function reset() {
                for(var i = this.particles.length - 1; i >= 0; i--){
                    this.particles[i].destroy();
                }
                this.particles = [];
                this.fireCooldown = 0;
            }
        },
        {
            key: "emit",
            value: function emit(origin, direction) {
                if (this.fireCooldown > 0 || this.particles.length >= this.maxParticles) return false;
                var particle = new FireParticle(this.scene, origin, direction);
                this.particles.push(particle);
                this.fireCooldown = GAME_CONFIG.FIRE_EMIT_COOLDOWN;
                return true; // Indicate that a particle was emitted
            }
        },
        {
            key: "update",
            value: function update(deltaTime, enemies, onEnemyHitCallback) {
                if (this.fireCooldown > 0) {
                    this.fireCooldown -= deltaTime;
                }
                for(var i = this.particles.length - 1; i >= 0; i--){
                    var particle = this.particles[i];
                    if (particle.update(deltaTime)) {
                        particle.destroy();
                        this.particles.splice(i, 1);
                    } else {
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            // Check collision with enemies
                            for(var _iterator = enemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var enemy = _step.value;
                                if (enemy.mesh && particle.mesh.position.distanceTo(enemy.mesh.position) < enemy.boundingRadius + GAME_CONFIG.FIRE_PARTICLE_SIZE) {
                                    enemy.takeDamage(GAME_CONFIG.FIRE_DAMAGE_PER_PARTICLE);
                                    if (enemy.health <= 0 && !enemy.isMarkedForRemoval) {
                                        onEnemyHitCallback(enemy);
                                        enemy.isMarkedForRemoval = true; // Prevent multiple score additions
                                    }
                                    particle.destroy(); // Fire particle is consumed on hit
                                    this.particles.splice(i, 1);
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
                    }
                }
            }
        }
    ]);
    return FireController;
}();
