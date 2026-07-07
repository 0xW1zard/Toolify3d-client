// Signed volume of a triangle mesh using the tetrahedron (divergence) method.
//
// For a closed (watertight) mesh, the enclosed volume equals the sum of the
// signed volumes of tetrahedra formed by the origin and each triangle face.
// For a triangle with vertices a, b, c (as position vectors from the origin),
// the signed volume of the tetrahedron (origin, a, b, c) is:
//
//     V = (a · (b × c)) / 6
//
// Summing this over every triangle, contributions from faces "facing away"
// cancel with those "facing toward" the origin, leaving only the enclosed
// volume. The sign depends on the winding order, so we take the absolute value.

// STL/OBJ print files are conventionally authored in millimeters, so the raw
// coordinate volume is in mm³. Filament density is expressed in g/cm³, hence the
// mm³ → cm³ conversion below (1 cm³ = 1000 mm³).
const MM3_PER_CM3 = 1000;

export function computeSignedVolumeMm3(positions) {
  let volume = 0;

  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i];
    const ay = positions[i + 1];
    const az = positions[i + 2];
    const bx = positions[i + 3];
    const by = positions[i + 4];
    const bz = positions[i + 5];
    const cx = positions[i + 6];
    const cy = positions[i + 7];
    const cz = positions[i + 8];

    // a · (b × c)
    const crossX = by * cz - bz * cy;
    const crossY = bz * cx - bx * cz;
    const crossZ = bx * cy - by * cx;

    volume += (ax * crossX + ay * crossY + az * crossZ) / 6;
  }

  return volume;
}

export function mm3ToCm3(volumeMm3) {
  return volumeMm3 / MM3_PER_CM3;
}
