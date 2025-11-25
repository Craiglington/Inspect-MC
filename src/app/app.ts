import { Component } from "@angular/core";
import { Header } from "./components/header/header";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  imports: [Header, RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.scss"
})
export class App {
  // async worldDirectoryChanged(event: Event) {
  //   if (!event.target) {
  //     return;
  //   }
  //   const inputElement: HTMLInputElement = event.target as HTMLInputElement;
  //   if (!inputElement.files?.length) {
  //     return;
  //   }
  //   for (const file of inputElement.files) {
  //     if (
  //       file.webkitRelativePath.endsWith(`hermitcraft10/region/${file.name}`) &&
  //       file.name.endsWith(".mca") &&
  //       file.name === "r.-1.-1.mca"
  //     ) {
  //       const anvilData = await this.fileReaderService.readAsArrayBuffer(file);
  //       for (let m = 0; m < 20; ++m) {
  //         for (let n = 0; n < 14; ++n) {
  //           const chunkData = await this.anvilService.getChunkData(
  //             anvilData,
  //             m,
  //             n
  //           );
  //           //console.log("region", file.webkitRelativePath, chunkData);
  //           if (!chunkData) return;
  //           const ids = this.anvilService.getChunkMapIds(chunkData);
  //           //console.log(ids);
  //           if (!this.canvasMap || !this.canvasMap.nativeElement) return;
  //           const ctx = this.canvasMap.nativeElement.getContext("2d");
  //           if (!ctx) return;
  //           for (let i = 0; i < 16; ++i) {
  //             for (let j = 0; j < 16; ++j) {
  //               const mapId = ids[j * 16 + i];
  //               if (j === 0) {
  //                 ctx.fillStyle = MapColors[mapId.mapColorId].color.same;
  //               } else {
  //                 const previousYLevel = ids[(j - 1) * 16 + i].yLevel;
  //                 if (previousYLevel < mapId.yLevel) {
  //                   ctx.fillStyle = MapColors[mapId.mapColorId].color.above;
  //                 } else if (previousYLevel === mapId.yLevel) {
  //                   ctx.fillStyle = MapColors[mapId.mapColorId].color.same;
  //                 } else {
  //                   ctx.fillStyle = MapColors[mapId.mapColorId].color.below;
  //                 }
  //               }
  //               ctx.fillRect(m * 16 + i, n * 16 + j, 1, 1);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}
