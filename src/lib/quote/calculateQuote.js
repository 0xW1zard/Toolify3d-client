import { computeSignedVolumeMm3, mm3ToCm3 } from './volume.js';

function round2(value) {
  return Math.round(value * 100) / 100;
}

function assertFiniteVolume(volumeCm3) {
  if (!Number.isFinite(volumeCm3) || volumeCm3 <= 0) {
    throw new Error(
      'Could not read a valid volume from this model. The mesh may be empty or not watertight.'
    );
  }
}

async function parseStl(buffer) {
  const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js');
  const geometry = new STLLoader().parse(buffer);
  const positions = geometry.getAttribute('position')?.array;
  if (!positions?.length) {
    throw new Error('This STL file contains no mesh data.');
  }
  return mm3ToCm3(Math.abs(computeSignedVolumeMm3(positions)));
}

async function parseObj(buffer) {
  const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');
  const text = new TextDecoder().decode(buffer);
  const object = new OBJLoader().parse(text);

  // An OBJ can contain multiple meshes; sum the volume of every geometry.
  let volumeMm3 = 0;
  object.traverse((child) => {
    const positions = child.geometry?.getAttribute?.('position')?.array;
    if (positions?.length) {
      volumeMm3 += Math.abs(computeSignedVolumeMm3(positions));
    }
  });

  if (volumeMm3 === 0) {
    throw new Error('This OBJ file contains no mesh data.');
  }
  return mm3ToCm3(volumeMm3);
}

// Reads a 3D model File and returns its physical volume in cm³.
// Parsing runs entirely in the browser using Three.js loaders (loaded lazily
// so the ~150KB three bundle is only fetched when a file is actually uploaded).
export async function parseModelFile(file) {
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const buffer = await file.arrayBuffer();

  let volumeCm3;
  if (extension === '.stl') {
    volumeCm3 = await parseStl(buffer);
  } else if (extension === '.obj') {
    volumeCm3 = await parseObj(buffer);
  } else {
    throw new Error('Only STL and OBJ files are supported.');
  }

  assertFiniteVolume(volumeCm3);
  return { volumeCm3 };
}

// Pure pricing math. Given a cached volume and the selected material, returns
// the estimated (solid) weight in grams and the total cost.
//
//   weight    = volume(cm³) × density(g/cm³)
//   totalCost = weight × costPerGram
export function calculateQuote({ volumeCm3, material }) {
  const weight = volumeCm3 * material.density;
  const totalCost = weight * material.costPerGram;

  return {
    estimatedWeight: round2(weight),
    totalCost: round2(totalCost),
  };
}
