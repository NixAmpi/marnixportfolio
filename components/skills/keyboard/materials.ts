import * as THREE from "three";
import { pbtNormalMap } from "./geometry";

/**
 * Matte PBT keycap material shared by every cap (instanced). Per-instance attributes:
 * - aUvRect (vec4): where this cap's legend lives in the atlas
 * - aDim   (float): 0…1, fades the legend for filtered-out keys (cap colour is dimmed on the CPU)
 * - aGlow  (float): 0…1, emissive glow (hover / press flash)
 * The legend is printed only on the top face (geometry attribute aTop).
 */
export function keycapMaterial(legend: THREE.Texture): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    roughness: 0.62,
    metalness: 0,
    normalMap: pbtNormalMap(),
    normalScale: new THREE.Vector2(0.12, 0.12),
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uLegend = { value: legend };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute vec2 aLegUv;
        attribute float aTop;
        attribute vec4 aUvRect;
        attribute float aDim;
        attribute float aGlow;
        varying vec2 vLegUv;
        varying float vTop;
        varying float vDim;
        varying float vGlow;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vLegUv = aUvRect.xy + aLegUv * aUvRect.zw;
        vTop = aTop;
        vDim = aDim;
        vGlow = aGlow;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform sampler2D uLegend;
        varying vec2 vLegUv;
        varying float vTop;
        varying float vDim;
        varying float vGlow;`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        vec4 legend = texture2D(uLegend, vLegUv);
        diffuseColor.rgb = mix(diffuseColor.rgb, legend.rgb, legend.a * vTop * (1.0 - vDim * 0.7));`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * vGlow * 0.6;`,
      );
  };
  mat.customProgramCacheKey = () => "keycap-legend-v1";
  return mat;
}
