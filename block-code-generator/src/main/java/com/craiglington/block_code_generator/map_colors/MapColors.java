package com.craiglington.block_code_generator.map_colors;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// /net/minecraft/world/level/material/MapColor.class -> /src/app/constants/map-colors.ts
public class MapColors {
  private static final String inputFile = "/MapColors/input.txt";
  private static final float BELOW_MULTIPLIER = 0.71f;
  private static final float SAME_MULTIPLIER = 0.86f;
  private static final Pattern pattern = Pattern
      .compile("^public static final MapColor (?<name>[A-Z_]+) = new MapColor\\([0-9]{1,2}, (?<value>[0-9]+)\\);$");

  public static void main(final String[] args) {
    try (final InputStream inputStream = MapColors.class.getResourceAsStream(inputFile)) {
      if (inputStream == null) {
        throw new IllegalArgumentException(String.format("File not found: %s.", inputFile));
      }

      final List<MapColor> mapColors = new ArrayList<>();
      try (final Scanner scanner = new Scanner(inputStream)) {
        while (scanner.hasNextLine()) {
          mapColors.add(getMapColor(scanner.nextLine()));
        }
      }

      final StringBuffer buffer = new StringBuffer();

      // First, just the color names
      for (final MapColor mapColor : mapColors) {
        buffer.append(mapColor.getName()).append(",\n");
      }

      buffer.append("\n");

      // Second, the color values
      for (final MapColor mapColor : mapColors) {
        buffer.append("{\n");
        buffer.append("\tid: MapIds.").append(mapColor.getName()).append(",\n");
        buffer.append("\tcolor: {\n");

        buffer.append("\t\tbelow: ").append(mapColor.multiply(BELOW_MULTIPLIER)).append(",\n");

        buffer.append("\t\tsame: ").append(mapColor.multiply(SAME_MULTIPLIER)).append(",\n");

        buffer.append("\t\tabove: ").append(mapColor).append("\n");

        buffer.append("\t}\n");
        buffer.append("},\n");
      }

      System.out.println(buffer.toString());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static MapColor getMapColor(final String input) {
    final Matcher matcher = pattern.matcher(input);
    if (!matcher.matches()) {
      throw new IllegalArgumentException(String.format("Invalid input: %s.", input));
    }

    final String name = matcher.group("name");
    final String value = matcher.group("value");
    if (name == null || value == null) {
      throw new IllegalArgumentException(String.format("Invalid input: %s.", input));
    }

    return new MapColor(name, Integer.parseInt(value));
  }
}
