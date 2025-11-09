import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FileReaderService {
  readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        try {
          if (!fileReader.result || typeof fileReader.result === "string") {
            throw new Error(
              "File reader error: Result is not an array buffer."
            );
          }

          resolve(fileReader.result);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      fileReader.onerror = (event) => {
        console.error(event);
        reject(event.target?.error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        try {
          if (typeof fileReader.result !== "string") {
            throw new Error("File reader error: Result is not a string.");
          }

          resolve(fileReader.result);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      fileReader.onerror = (event) => {
        console.error(event);
        reject(event.target?.error);
      };
      fileReader.readAsText(file);
    });
  }
}
