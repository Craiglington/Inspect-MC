/**
 * A Map with an automatic least-recently-used eviction policy.
 */
export class LruEvictionMap<K, V> extends Map<K, V> {
  private _maxSize: number;

  constructor(sizeLimit?: number) {
    super();
    this._maxSize = sizeLimit ?? 1;
  }

  get maxSize(): number {
    return this._maxSize;
  }

  set maxSize(maxSize: number) {
    this._maxSize = maxSize;
  }

  override get(key: K): V | undefined {
    if (!this.has(key)) return undefined;
    const value = super.get(key)!;
    this.delete(key);
    super.set(key, value);
    return value;
  }

  override set(key: K, value: V): this {
    this.delete(key);
    super.set(key, value);
    if (this.size > this._maxSize) {
      const lruKey = this.keys().next().value;
      if (lruKey !== undefined) {
        this.delete(lruKey);
      }
    }
    return this;
  }
}
