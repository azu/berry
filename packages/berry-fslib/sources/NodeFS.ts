import fs, {Stats}                                         from 'fs';

import {CreateReadStreamOptions, CreateWriteStreamOptions} from './FakeFS';
import {FakeFS, WriteFileOptions}                          from './FakeFS';

export class NodeFS extends FakeFS {
  private readonly realFs: typeof fs;

  constructor(realFs: typeof fs = fs) {
    super();

    this.realFs = realFs;
  }

  getRealPath() {
    return `/`;
  }

  async openPromise(p: string, flags: string, mode?: number) {
    return await new Promise<number>((resolve, reject) => {
      this.realFs.open(p, flags, mode, this.makeCallback(resolve, reject));
    });
  }

  openSync(p: string, flags: string, mode?: number) {
    return this.realFs.openSync(p, flags, mode);
  }

  async closePromise(fd: number) {
    await new Promise<void>((resolve, reject) => {
      this.realFs.close(fd, this.makeCallback(resolve, reject));
    });
  }

  closeSync(fd: number) {
    this.realFs.closeSync(fd);
  }

  createReadStream(p: string, opts?: CreateReadStreamOptions) {
    return this.realFs.createReadStream(this.fromPortablePath(p), opts);
  }

  createWriteStream(p: string, opts?: CreateWriteStreamOptions) {
    return this.realFs.createWriteStream(this.fromPortablePath(p), opts);
  }

  async realpathPromise(p: string) {
    return await new Promise<string>((resolve, reject) => {
      this.realFs.realpath(p, {}, this.makeCallback(resolve, reject));
    });
  }

  realpathSync(p: string) {
    return this.toPortablePath(this.realFs.realpathSync(this.fromPortablePath(p), {}));
  }

  async existsPromise(p: string) {
    return await new Promise<boolean>(resolve => {
      this.realFs.exists(this.fromPortablePath(p), resolve);
    });
  }

  existsSync(p: string) {
    return this.realFs.existsSync(this.fromPortablePath(p));
  }

  async statPromise(p: string) {
    return await new Promise<Stats>((resolve, reject) => {
      this.realFs.stat(p, this.makeCallback(resolve, reject));
    });
  }

  statSync(p: string) {
    return this.realFs.statSync(this.fromPortablePath(p));
  }

  async lstatPromise(p: string) {
    return await new Promise<Stats>((resolve, reject) => {
      this.realFs.lstat(p, this.makeCallback(resolve, reject));
    });
  }

  lstatSync(p: string) {
    return this.realFs.lstatSync(this.fromPortablePath(p));
  }

  async chmodPromise(p: string, mask: number) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.chmod(this.fromPortablePath(p), mask, this.makeCallback(resolve, reject));
    });
  }

  chmodSync(p: string, mask: number) {
    return this.realFs.chmodSync(this.fromPortablePath(p), mask);
  }

  async renamePromise(oldP: string, newP: string) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.rename(this.fromPortablePath(oldP), this.fromPortablePath(newP), this.makeCallback(resolve, reject));
    });
  }

  renameSync(oldP: string, newP: string) {
    return this.realFs.renameSync(this.fromPortablePath(oldP), this.fromPortablePath(newP));
  }

  async copyFilePromise(sourceP: string, destP: string, flags: number = 0) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.copyFile(this.fromPortablePath(sourceP), this.fromPortablePath(destP), flags, this.makeCallback(resolve, reject));
    });
  }

  copyFileSync(sourceP: string, destP: string, flags: number = 0) {
    return this.realFs.copyFileSync(this.fromPortablePath(sourceP), this.fromPortablePath(destP), flags);
  }

  async writeFilePromise(p: string, content: string | Buffer | ArrayBuffer | DataView, opts?: WriteFileOptions) {
    return await new Promise<void>((resolve, reject) => {
      if (opts) {
        this.realFs.writeFile(p, content, opts, this.makeCallback(resolve, reject));
      } else {
        this.realFs.writeFile(p, content, this.makeCallback(resolve, reject));
      }
    });
  }

  writeFileSync(p: string, content: string | Buffer | ArrayBuffer | DataView, opts?: WriteFileOptions) {
    if (opts) {
      this.realFs.writeFileSync(this.fromPortablePath(p), content, opts);
    } else {
      this.realFs.writeFileSync(this.fromPortablePath(p), content);
    }
  }

  async unlinkPromise(p: string) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.unlink(p, this.makeCallback(resolve, reject));
    });
  }

  unlinkSync(p: string) {
    return this.realFs.unlinkSync(this.fromPortablePath(p));
  }

  async utimesPromise(p: string, atime: Date | string | number, mtime: Date | string | number) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.utimes(p, atime, mtime, this.makeCallback(resolve, reject));
    });
  }

  utimesSync(p: string, atime: Date | string | number, mtime: Date | string | number) {
    this.realFs.utimesSync(p, atime, mtime);
  }

  async mkdirPromise(p: string) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.mkdir(p, this.makeCallback(resolve, reject));
    });
  }

  mkdirSync(p: string) {
    return this.realFs.mkdirSync(this.fromPortablePath(p));
  }

  async rmdirPromise(p: string) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.rmdir(p, this.makeCallback(resolve, reject));
    });
  }

  rmdirSync(p: string) {
    return this.realFs.rmdirSync(this.fromPortablePath(p));
  }

  async symlinkPromise(target: string, p: string) {
    return await new Promise<void>((resolve, reject) => {
      this.realFs.symlink(target, this.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  symlinkSync(target: string, p: string) {
    return this.realFs.symlinkSync(target, this.fromPortablePath(p));
  }

  readFilePromise(p: string, encoding: 'utf8'): Promise<string>;
  readFilePromise(p: string, encoding?: string): Promise<Buffer>;
  async readFilePromise(p: string, encoding?: string) {
    return await new Promise<any>((resolve, reject) => {
      this.realFs.readFile(this.fromPortablePath(p), encoding, this.makeCallback(resolve, reject));
    });
  }

  readFileSync(p: string, encoding: 'utf8'): string;
  readFileSync(p: string, encoding?: string): Buffer;
  readFileSync(p: string, encoding?: string) {
    return this.realFs.readFileSync(this.fromPortablePath(p), encoding);
  }

  async readdirPromise(p: string) {
    return await new Promise<Array<string>>((resolve, reject) => {
      this.realFs.readdir(p, this.makeCallback(resolve, reject));
    });
  }

  readdirSync(p: string) {
    return this.realFs.readdirSync(this.fromPortablePath(p));
  }

  async readlinkPromise(p: string) {
    return await new Promise<string>((resolve, reject) => {
      this.realFs.readlink(p, this.makeCallback(resolve, reject));
    });
  }

  readlinkSync(p: string) {
    return this.realFs.readlinkSync(this.fromPortablePath(p));
  }

  private makeCallback<T>(resolve: (value?: T) => void, reject: (reject: Error) => void) {
    return (err: Error, result?: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
  }

  private fromPortablePath(p: string) {
    return p;
  }

  private toPortablePath(p: string) {
    return p;
  }
}
