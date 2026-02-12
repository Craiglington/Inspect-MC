export class AsyncQueue {
  private numCurrentProcesses: number;
  private _maxConcurrentProcesses!: number;
  private processes: (() => Promise<void>)[] = [];

  constructor(maxConcurrentProcesses?: number) {
    this.maxConcurrentProcesses = maxConcurrentProcesses ?? 1;
    this.numCurrentProcesses = 0;
  }

  get maxConcurrentProcesses(): number {
    return this._maxConcurrentProcesses;
  }

  set maxConcurrentProcesses(maxConcurrentProcesses: number) {
    if (maxConcurrentProcesses <= 0) {
      throw new Error(
        `Invalid maximum concurrent processes value: ${maxConcurrentProcesses}.`
      );
    }
    this._maxConcurrentProcesses = maxConcurrentProcesses;
  }

  clear() {
    this.processes.length = 0;
  }

  enqueue<T>(process: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const wrappedProcess = async (): Promise<void> => {
        try {
          const result = await process();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      this.processes.push(wrappedProcess);
      this.runNextProcess();
    });
  }

  private runNextProcess() {
    if (
      this.numCurrentProcesses >= this._maxConcurrentProcesses ||
      this.processes.length <= 0
    ) {
      return;
    }

    this.numCurrentProcesses++;

    const nextProcess = this.processes.shift()!;
    nextProcess().finally(() => {
      this.numCurrentProcesses--;
      this.runNextProcess();
    });
  }
}
