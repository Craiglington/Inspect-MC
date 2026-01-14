import { inject, Injectable } from "@angular/core";
import { SNBT } from "../../models/snbt";
import { DecompressionService } from "../decompression/decompression-service";
import { FileReaderService } from "../file-reader/file-reader-service";
import { NBTService } from "../nbt/nbt-service";
import { NotificationService } from "../notification/notification-service";

@Injectable({
  providedIn: "root"
})
export class DatService {
  private readonly fileReaderService = inject(FileReaderService);
  private readonly decompressionService = inject(DecompressionService);
  private readonly nbtService = inject(NBTService);
  private readonly notificationService = inject(NotificationService);

  async getSNBT<T extends SNBT>(file: File): Promise<T | undefined> {
    // Get the file data.
    const compressedData = await this.fileReaderService.readAsArrayBuffer(file);

    // Check which compression method was used and decompress the data.
    let decompressedData: ArrayBuffer;
    if (this.decompressionService.isValidGzipData(compressedData)) {
      decompressedData = await this.decompressionService.decompressData(
        compressedData,
        "gzip"
      );
    } else if (this.decompressionService.isValidZlibData(compressedData)) {
      decompressedData = await this.decompressionService.decompressData(
        compressedData,
        "deflate"
      );
    } else {
      decompressedData = compressedData;
    }

    // Check the NBT validity.
    if (!this.nbtService.isValidNBTData(decompressedData)) {
      this.notificationService.notify({
        message: "Invalid '.dat' file/format."
      });
      return undefined;
    }

    // Parse the NBT data to get an SNBT.
    return this.nbtService.getSNBT(decompressedData) as T;
  }
}
