package com.craiglington.block_code_generator.blocks;

import java.io.File;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Not as automated as {@code MapColors.java}. Pass in the absolute path to a
 * blockstates directory ({@code /assets/minecraft/blockstates}) in a Minecraft
 * version as a command-line argument. Compare outputs and use the values in
 * {@code /net/minecraft/world/level/block/Blocks.class} and
 * {@code /net/minecraft/references/BlockItemIds.class} to figure out which
 * color each block should be on a map.
 * 
 * Use the output to fill out the {@code /src/app/constants/map-palettes/*.ts}
 * files.
 */
public class Blocks {

  public static void main(final String[] args) {
    try {
      if (args.length != 1) {
        throw new IllegalArgumentException(
            "Pass the path to the blockstates directory as the only command-line argument.");
      }

      System.out.println(args[0]);

      File blockstatesDirectory = new File(args[0]);
      if (!blockstatesDirectory.exists() || !blockstatesDirectory.isDirectory()) {
        throw new IllegalArgumentException(String.format("The file at %s either does not exist or is not a directory.",
            blockstatesDirectory.getAbsolutePath()));
      }

      File[] files = blockstatesDirectory.listFiles((File file) -> file.isFile());
      if (files == null) {
        throw new IllegalArgumentException(
            String.format("Unable to access the files in %s.", blockstatesDirectory.getAbsolutePath()));
      }

      String fileNames = Arrays.stream(files).map((File file) -> {
        final String name = file.getName();
        return name.substring(0, name.length() - 5);
      }).sorted().collect(Collectors.joining("\n"));

      System.out.println(fileNames);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
