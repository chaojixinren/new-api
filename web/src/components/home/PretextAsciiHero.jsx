/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useRef, useState } from 'react';
import { prepareWithSegments } from '@chenglou/pretext';

const CHARSET =
  ' .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const PROP_FAMILY = 'Georgia, "Times New Roman", serif';
const WEIGHTS = [300, 500, 800];
const STYLES = ['normal', 'italic'];
const FIELD_OVERSAMPLE = 2;
const FIELD_DECAY = 0.84;

const paletteCache = new Map();
const spriteCache = new Map();

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(char) {
  if (char === '<') return '&lt;';
  if (char === '>') return '&gt;';
  if (char === '&') return '&amp;';
  if (char === '"') return '&quot;';
  return char;
}

function getWeightClass(weight, style) {
  const base =
    weight === 300
      ? 'na-pretext-weight-300'
      : weight === 500
        ? 'na-pretext-weight-500'
        : 'na-pretext-weight-800';
  return style === 'italic' ? `${base} na-pretext-italic` : base;
}

function getFontDefinition(fontSize, weight, style) {
  return `${style === 'italic' ? 'italic ' : ''}${weight} ${fontSize}px ${PROP_FAMILY}`;
}

function measureWidth(char, font) {
  const prepared = prepareWithSegments(char, font);
  return prepared.widths[0] || 0;
}

function estimateBrightness(context, char, font, size) {
  context.clearRect(0, 0, size, size);
  context.font = font;
  context.fillStyle = '#ffffff';
  context.textBaseline = 'middle';
  context.fillText(char, 1, size / 2);
  const { data } = context.getImageData(0, 0, size, size);
  let alphaTotal = 0;
  for (let index = 3; index < data.length; index += 4) {
    alphaTotal += data[index];
  }
  return alphaTotal / (255 * size * size);
}

async function getPalette(fontSize) {
  if (paletteCache.has(fontSize)) {
    return paletteCache.get(fontSize);
  }

  const ready = document.fonts?.ready || Promise.resolve();
  const promise = ready.then(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('pretext brightness context unavailable');
    }

    const sampleSize = Math.max(28, fontSize * 2 + 8);
    canvas.width = sampleSize;
    canvas.height = sampleSize;

    const palette = [];
    for (const style of STYLES) {
      for (const weight of WEIGHTS) {
        const font = getFontDefinition(fontSize, weight, style);
        for (const char of CHARSET) {
          if (char === ' ') continue;
          const width = measureWidth(char, font);
          if (width <= 0) continue;
          const brightness = estimateBrightness(
            context,
            char,
            font,
            sampleSize,
          );
          palette.push({
            char,
            width,
            brightness,
            weight,
            style,
          });
        }
      }
    }

    const maxBrightness = Math.max(...palette.map((entry) => entry.brightness));
    return palette
      .map((entry) => ({
        ...entry,
        brightness: maxBrightness > 0 ? entry.brightness / maxBrightness : 0,
      }))
      .sort((left, right) => left.brightness - right.brightness);
  });

  paletteCache.set(fontSize, promise);
  return promise;
}

function findBestGlyph(palette, targetBrightness, cellWidth) {
  let low = 0;
  let high = palette.length - 1;

  while (low < high) {
    const mid = (low + high) >> 1;
    if (palette[mid].brightness < targetBrightness) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  let best = palette[low];
  let bestScore = Number.POSITIVE_INFINITY;
  const start = Math.max(0, low - 15);
  const end = Math.min(palette.length, low + 15);

  for (let index = start; index < end; index += 1) {
    const entry = palette[index];
    const brightnessError = Math.abs(entry.brightness - targetBrightness) * 2.6;
    const widthError =
      Math.abs(entry.width - cellWidth) / Math.max(cellWidth, 1);
    const score = brightnessError + widthError;
    if (score < bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best;
}

function buildLookup(palette, cellWidth) {
  const lookup = [];

  for (let brightnessByte = 0; brightnessByte < 256; brightnessByte += 1) {
    const brightness = brightnessByte / 255;

    if (brightness < 0.035) {
      lookup.push({ propHtml: ' ' });
      continue;
    }

    const match = findBestGlyph(palette, brightness, cellWidth);
    const alphaIndex = clamp(Math.round(brightness * 10), 1, 10);
    lookup.push({
      propHtml: `<span class="na-pretext-glyph ${getWeightClass(
        match.weight,
        match.style,
      )} na-pretext-alpha-${alphaIndex}">${escapeHtml(match.char)}</span>`,
    });
  }

  return lookup;
}

function getSpriteCanvas(radius) {
  if (spriteCache.has(radius)) {
    return spriteCache.get(radius);
  }

  const canvas = document.createElement('canvas');
  canvas.width = radius * 2;
  canvas.height = radius * 2;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('pretext sprite context unavailable');
  }

  const gradient = context.createRadialGradient(
    radius,
    radius,
    0,
    radius,
    radius,
    radius,
  );
  gradient.addColorStop(0, 'rgba(255,245,225,0.58)');
  gradient.addColorStop(0.36, 'rgba(255,205,165,0.22)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, radius * 2, radius * 2);

  spriteCache.set(radius, canvas);
  return canvas;
}

function spriteAlphaAt(distance) {
  if (distance >= 1) return 0;
  if (distance <= 0.35) {
    return 0.48 + ((0.16 - 0.48) * distance) / 0.35;
  }
  return 0.16 * (1 - (distance - 0.35) / 0.65);
}

function createFieldStamp(radius, scaleX, scaleY) {
  const radiusX = Math.ceil(radius * scaleX);
  const radiusY = Math.ceil(radius * scaleY);
  const sizeX = radiusX * 2 + 1;
  const sizeY = radiusY * 2 + 1;
  const values = new Float32Array(sizeX * sizeY);

  for (let y = -radiusY; y <= radiusY; y += 1) {
    for (let x = -radiusX; x <= radiusX; x += 1) {
      const normalizedDistance = Math.sqrt(
        (x / Math.max(radius * scaleX, 1)) ** 2 +
          (y / Math.max(radius * scaleY, 1)) ** 2,
      );
      values[(y + radiusY) * sizeX + x + radiusX] =
        spriteAlphaAt(normalizedDistance);
    }
  }

  return {
    radiusX,
    radiusY,
    sizeX,
    values,
  };
}

function splatFieldStamp(
  centerX,
  centerY,
  stamp,
  field,
  fieldCols,
  fieldRows,
  scaleX,
  scaleY,
) {
  const gridCenterX = Math.round(centerX * scaleX);
  const gridCenterY = Math.round(centerY * scaleY);

  for (let y = -stamp.radiusY; y <= stamp.radiusY; y += 1) {
    const gridY = gridCenterY + y;
    if (gridY < 0 || gridY >= fieldRows) continue;

    const fieldRowOffset = gridY * fieldCols;
    const stampRowOffset = (y + stamp.radiusY) * stamp.sizeX;

    for (let x = -stamp.radiusX; x <= stamp.radiusX; x += 1) {
      const gridX = gridCenterX + x;
      if (gridX < 0 || gridX >= fieldCols) continue;

      const stampValue = stamp.values[stampRowOffset + x + stamp.radiusX];
      if (stampValue === 0) continue;

      const fieldIndex = fieldRowOffset + gridX;
      field[fieldIndex] = Math.min(1, field[fieldIndex] + stampValue);
    }
  }
}

function createMetrics(width, height = 0) {
  const safeWidth = Math.max(width, 280);
  const safeHeight = Math.max(height, 320);
  const compact = safeWidth < 540;
  const fontSize = compact ? 10 : safeWidth < 960 ? 11 : 12;
  const lineHeight = fontSize + 2;
  const cols = clamp(
    Math.floor((safeWidth - 16) / (compact ? 6.5 : 7.2)),
    40,
    compact ? 60 : 120,
  );
  const rows = clamp(Math.floor((safeHeight - 16) / lineHeight), 20, 60);

  return {
    width: safeWidth,
    cols,
    rows,
    fontSize,
    lineHeight,
    height: rows * lineHeight,
  };
}

const PretextAsciiHero = ({ className = '' }) => {
  const panelRef = useRef(null);
  const canvasRef = useRef(null);
  const rowRefs = useRef([]);
  const frameRef = useRef(0);
  const [metrics, setMetrics] = useState(() => createMetrics(460, 420));

  useEffect(() => {
    const element = panelRef.current;
    if (!element) return undefined;

    const updateMetrics = () => {
      const nextMetrics = createMetrics(
        element.clientWidth,
        element.clientHeight,
      );
      setMetrics((current) => {
        if (
          current.width === nextMetrics.width &&
          current.cols === nextMetrics.cols &&
          current.rows === nextMetrics.rows &&
          current.fontSize === nextMetrics.fontSize &&
          current.lineHeight === nextMetrics.lineHeight
        ) {
          return current;
        }
        return nextMetrics;
      });
    };

    updateMetrics();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateMetrics);
      return () => window.removeEventListener('resize', updateMetrics);
    }

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, metrics.rows);
  }, [metrics.rows]);

  useEffect(() => {
    let cancelled = false;

    const canvas = canvasRef.current;
    const rowNodes = rowRefs.current.slice(0, metrics.rows);

    if (
      !canvas ||
      rowNodes.length !== metrics.rows ||
      rowNodes.some((node) => !node)
    ) {
      return undefined;
    }

    const start = async () => {
      const palette = await getPalette(metrics.fontSize);
      if (cancelled) return;

      const cellWidth = metrics.width / metrics.cols;
      const lookup = buildLookup(palette, cellWidth);
      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = metrics.width;
      const logicalHeight = metrics.height;
      canvas.width = Math.round(logicalWidth * dpr);
      canvas.height = Math.round(logicalHeight * dpr);
      canvas.style.width = `${logicalWidth}px`;
      canvas.style.height = `${logicalHeight}px`;

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fieldCols = metrics.cols * FIELD_OVERSAMPLE;
      const fieldRows = metrics.rows * FIELD_OVERSAMPLE;
      const fieldScaleX = fieldCols / logicalWidth;
      const fieldScaleY = fieldRows / logicalHeight;
      const brightnessField = new Float32Array(fieldCols * fieldRows);
      const particleCount = clamp(Math.round(metrics.cols * 1.8), 56, 96);
      const particleRadius = clamp(Math.round(logicalWidth / 34), 8, 16);
      const attractorRadius = Math.round(particleRadius * 1.4);
      const largeAttractorRadius = Math.round(particleRadius * 2.15);

      const particleFieldStamp = createFieldStamp(
        particleRadius,
        fieldScaleX,
        fieldScaleY,
      );
      const smallAttractorFieldStamp = createFieldStamp(
        attractorRadius,
        fieldScaleX,
        fieldScaleY,
      );
      const largeAttractorFieldStamp = createFieldStamp(
        largeAttractorRadius,
        fieldScaleX,
        fieldScaleY,
      );

      const particles = Array.from({ length: particleCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const radius =
          Math.random() * (logicalWidth * 0.18) + logicalWidth * 0.08;
        return {
          x: logicalWidth / 2 + Math.cos(angle) * radius,
          y: logicalHeight / 2 + Math.sin(angle) * radius * 0.45,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
        };
      });

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      const drawFrame = (timestamp) => {
        if (cancelled) return;

        const time = prefersReducedMotion ? 0 : timestamp;
        const attractor1X =
          Math.cos(time * 0.00072) * logicalWidth * 0.26 + logicalWidth / 2;
        const attractor1Y =
          Math.sin(time * 0.00108) * logicalHeight * 0.32 + logicalHeight / 2;
        const attractor2X =
          Math.cos(time * 0.00118 + Math.PI) * logicalWidth * 0.18 +
          logicalWidth / 2;
        const attractor2Y =
          Math.sin(time * 0.00094 + Math.PI) * logicalHeight * 0.26 +
          logicalHeight / 2;

        if (!prefersReducedMotion) {
          for (let index = 0; index < particles.length; index += 1) {
            const particle = particles[index];
            const delta1X = attractor1X - particle.x;
            const delta1Y = attractor1Y - particle.y;
            const delta2X = attractor2X - particle.x;
            const delta2Y = attractor2Y - particle.y;
            const distance1 = delta1X ** 2 + delta1Y ** 2;
            const distance2 = delta2X ** 2 + delta2Y ** 2;
            const useFirst = distance1 < distance2;
            const distance = Math.sqrt(Math.min(distance1, distance2)) + 1;
            const deltaX = useFirst ? delta1X : delta2X;
            const deltaY = useFirst ? delta1Y : delta2Y;
            const force = useFirst ? 0.22 : 0.06;

            particle.vx += (deltaX / distance) * force;
            particle.vy += (deltaY / distance) * force;
            particle.vx += (Math.random() - 0.5) * 0.18;
            particle.vy += (Math.random() - 0.5) * 0.18;
            particle.vx *= 0.972;
            particle.vy *= 0.972;
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < -particleRadius) {
              particle.x += logicalWidth + particleRadius * 2;
            }
            if (particle.x > logicalWidth + particleRadius) {
              particle.x -= logicalWidth + particleRadius * 2;
            }
            if (particle.y < -particleRadius) {
              particle.y += logicalHeight + particleRadius * 2;
            }
            if (particle.y > logicalHeight + particleRadius) {
              particle.y -= logicalHeight + particleRadius * 2;
            }
          }
        }

        context.fillStyle = 'rgba(29, 13, 18, 0.22)';
        context.fillRect(0, 0, logicalWidth, logicalHeight);
        context.globalCompositeOperation = 'lighter';

        const particleSprite = getSpriteCanvas(particleRadius);
        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index];
          context.drawImage(
            particleSprite,
            particle.x - particleRadius,
            particle.y - particleRadius,
          );
        }

        context.drawImage(
          getSpriteCanvas(largeAttractorRadius),
          attractor1X - largeAttractorRadius,
          attractor1Y - largeAttractorRadius,
        );
        context.drawImage(
          getSpriteCanvas(attractorRadius),
          attractor2X - attractorRadius,
          attractor2Y - attractorRadius,
        );
        context.globalCompositeOperation = 'source-over';

        for (let index = 0; index < brightnessField.length; index += 1) {
          brightnessField[index] *= FIELD_DECAY;
        }

        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index];
          splatFieldStamp(
            particle.x,
            particle.y,
            particleFieldStamp,
            brightnessField,
            fieldCols,
            fieldRows,
            fieldScaleX,
            fieldScaleY,
          );
        }

        splatFieldStamp(
          attractor1X,
          attractor1Y,
          largeAttractorFieldStamp,
          brightnessField,
          fieldCols,
          fieldRows,
          fieldScaleX,
          fieldScaleY,
        );
        splatFieldStamp(
          attractor2X,
          attractor2Y,
          smallAttractorFieldStamp,
          brightnessField,
          fieldCols,
          fieldRows,
          fieldScaleX,
          fieldScaleY,
        );

        for (let row = 0; row < metrics.rows; row += 1) {
          let rowHtml = '';
          const fieldRowStart = row * FIELD_OVERSAMPLE * fieldCols;
          for (let col = 0; col < metrics.cols; col += 1) {
            const fieldColStart = col * FIELD_OVERSAMPLE;
            let brightness = 0;

            for (let sampleY = 0; sampleY < FIELD_OVERSAMPLE; sampleY += 1) {
              const sampleRowOffset =
                fieldRowStart + sampleY * fieldCols + fieldColStart;
              for (let sampleX = 0; sampleX < FIELD_OVERSAMPLE; sampleX += 1) {
                brightness += brightnessField[sampleRowOffset + sampleX];
              }
            }

            const brightnessByte = Math.min(
              255,
              Math.floor(
                (brightness / (FIELD_OVERSAMPLE * FIELD_OVERSAMPLE)) * 255,
              ),
            );
            rowHtml += lookup[brightnessByte].propHtml;
          }

          rowNodes[row].innerHTML = rowHtml;
        }

        if (!prefersReducedMotion) {
          frameRef.current = window.requestAnimationFrame(drawFrame);
        }
      };

      frameRef.current = window.requestAnimationFrame(drawFrame);
    };

    start().catch((error) => {
      console.error('Failed to initialize pretext hero art', error);
    });

    return () => {
      cancelled = true;
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [
    metrics.cols,
    metrics.fontSize,
    metrics.height,
    metrics.lineHeight,
    metrics.rows,
    metrics.width,
  ]);

  return (
    <div
      ref={panelRef}
      className={`na-pretext-panel ${className}`.trim()}
      aria-hidden='true'
    >
      <div
        className='na-pretext-stage'
        style={{ minHeight: `${metrics.height}px` }}
      >
        <canvas ref={canvasRef} className='na-pretext-source-canvas' />
        <div className='na-pretext-grid'>
          {Array.from({ length: metrics.rows }).map((_, index) => (
            <div
              key={index}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              className='na-pretext-row'
              style={{
                height: `${metrics.lineHeight}px`,
                lineHeight: `${metrics.lineHeight}px`,
                fontSize: `${metrics.fontSize}px`,
              }}
            />
          ))}
        </div>
        <div className='na-pretext-stage-glow' />
      </div>
    </div>
  );
};

export default PretextAsciiHero;
