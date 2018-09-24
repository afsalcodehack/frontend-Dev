export class EndPoint {
  public backend: any;

  constructor(
    public path: string,
    public implemented: boolean = false,
    public fakeData: any = null,
    public done?: (request: any, response: any) => void,
  ) { }

  toURL() {
    return this.backend.baseURL + this.path + '/';
  }
}

export class Backend {
  paths = {};

  constructor(
    public baseURL: string,
    paths: EndPoint[],
  ) {
    if (this.baseURL.slice(-1) !== '/') {
      this.baseURL += '/';
    }

    for (let path of paths) {
      path.backend = this;
      this.paths[path.path] = path;
      this.paths['/' + path.path + '/'] = path;
    }
  }
}
