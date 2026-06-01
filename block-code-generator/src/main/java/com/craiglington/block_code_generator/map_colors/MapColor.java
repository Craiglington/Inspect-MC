package com.craiglington.block_code_generator.map_colors;

public class MapColor {
  private static final int HEX_STRING_LENGTH = 6;
  private final String name;
  private final int r;
  private final int g;
  private final int b;
  private final int a;

  public MapColor(final String name, final int value) {
    this.name = name;
    final StringBuffer buffer = new StringBuffer(Integer.toHexString(value));
    buffer.insert(0, "0".repeat(HEX_STRING_LENGTH - buffer.length()));
    final String hex = buffer.toString();
    this.r = Integer.parseInt(hex.substring(0, 2), 16);
    this.g = Integer.parseInt(hex.substring(2, 4), 16);
    this.b = Integer.parseInt(hex.substring(4, 6), 16);
    this.a = value > 0 ? 255 : 0;
  }

  public MapColor(final String name, final int r, final int g, final int b, final int a) {
    this.name = name;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public String getName() {
    return this.name;
  }

  public int getR() {
    return this.r;
  }

  public int getG() {
    return this.g;
  }

  public int getB() {
    return this.b;
  }

  public int getA() {
    return this.a;
  }

  public MapColor multiply(final float multiplier) {
    return new MapColor(this.name, Math.round(this.r * multiplier), Math.round(this.g * multiplier),
        Math.round(this.b * multiplier), this.a);
  }

  @Override
  public String toString() {
    return String.format("{ r: %d, g: %d, b: %d, a: %d }", this.r, this.g, this.b, this.a);
  }

}
