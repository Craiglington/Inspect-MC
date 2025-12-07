/**
 * The `finalYLevels` property holds the y-levels of the last horizontal row (row with the highest z coordinate) of blocks in a chunk.
 * This is needed because a block's map color depends on how its y-level compares to the block north of it.
 * It is an array that should have a length of 16 (chunks are 16 x 16).
 */
export interface ChunkImage {
  image: ImageBitmap;
  finalYLevels: number[];
}
