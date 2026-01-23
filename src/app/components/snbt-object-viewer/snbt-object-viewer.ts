import { NgClass } from "@angular/common";
import { Component, computed, Input, Signal, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SNBT, SNBTValue } from "../../models/snbt";

export interface Property {
  name: string;
  value: SNBTValue;
  objectDescription?: string;
}

@Component({
  selector: "app-snbt-object-viewer",
  imports: [MatButtonModule, MatIconModule, NgClass],
  templateUrl: "./snbt-object-viewer.html",
  styleUrl: "./snbt-object-viewer.scss"
})
export class SnbtObjectViewerComponent {
  private _data = signal<Property[]>([]);
  @Input() set data(value: SNBT | SNBTValue[] | undefined) {
    this._openIndices.update(() => {
      return new Set();
    });
    if (!value) {
      this._data.set([]);
    } else if (Array.isArray(value)) {
      this._data.set(
        value.map((arrayValue, i) => this.getProperty(`${i + 1}`, arrayValue))
      );
    } else {
      this._data.set(
        Object.entries(value).map((entry) =>
          this.getProperty(entry[0], entry[1])
        )
      );
    }
  }
  get data(): Signal<Property[]> {
    return computed(() => this._data());
  }

  private readonly _openIndices = signal<Set<number>>(new Set());
  @Input() set startingOpenIndices(indices: number[]) {
    this._openIndices.update((openIndices) => {
      const next = new Set(openIndices);
      for (const index of indices) {
        next.add(index);
      }
      return next;
    });
  }

  protected isOpen(index: number) {
    return computed(() => this._openIndices().has(index));
  }

  protected toggle(index: number) {
    this._openIndices.update((openIndices) => {
      const next = new Set(openIndices);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  private getProperty(name: string, value: SNBTValue): Property {
    return {
      name: name,
      value: this.getPropertyValue(value),
      objectDescription: this.getObjectDescription(value)
    };
  }

  private getPropertyValue(value: SNBTValue) {
    if (typeof value === "string") {
      return `"${value}"`;
    }
    return value;
  }

  private getObjectDescription(value: SNBTValue) {
    if (typeof value !== "object") {
      return undefined;
    }
    if (Array.isArray(value)) {
      return `Array(${value.length})`;
    }
    return `Object(${Object.keys(value).length})`;
  }
}
