import { Injectable } from '@angular/core';
import { ScriptStore } from '../../app/app.module';

export interface Script {
  name: string;
  src: string;
}

interface ScriptStatus {
  loaded: boolean;
  src?: string;
  status?: string;
  script?: string;
}

declare var document: HTMLDocument;

@Injectable()
export class ScriptProvider {
  private scripts = new Map<string, ScriptStatus>();

  constructor() {
    ScriptStore.forEach((script: Script) => {
      this.scripts[script.name] = { loaded: false, src: script.src };
    });
  }

  loadScript(name: string) {
    return new Promise<ScriptStatus>((resolve, reject) => {
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already loaded' });
      } else {
        if (document.getElementById(name)) { return; }
        const script = document.createElement('script');
        script.id = name;
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.scripts[name].loaded = true;
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (err: string | Event) => {
          this.scripts[name].loaded = false;
          reject({ script: name, loaded: false, status: err.toString() });
        };
        const head = document.querySelector('head');
        if (head) {
          head.appendChild(script);
        }
      }
    });
  }
}
