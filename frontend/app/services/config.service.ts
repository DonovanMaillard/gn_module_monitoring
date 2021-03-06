import { Utils } from './../utils/utils';
// import _ from "lodash";
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@geonature_config/app.config';
import { ModuleConfig } from '../module.config';

import { of } from '@librairies/rxjs';
import { mergeMap } from '@librairies/rxjs/operators';

@Injectable()
export class ConfigService {
  private _config;

  constructor(private _http: HttpClient) { }

  /** Configuration */

  init(moduleCode = null) {

    // a definir ailleurs

    moduleCode = moduleCode || 'generic';

    if (this._config && this._config[moduleCode]) {
      return of(true);
    } else {
      return this.loadConfig(moduleCode);
    }
  }

  loadConfig(moduleCode) {
    const urlConfig = moduleCode === 'generic'
      ? `${this.backendModuleUrl()}/config`
      : `${this.backendModuleUrl()}/config/${moduleCode}`;
    return this._http.get<any>(urlConfig)
      .pipe(
        mergeMap((config) => {
          this._config = this._config || {};
          this._config[moduleCode] = config;
          this._config['frontendParams'] = {
            'bChainInput': false
          };
          return of(true);
        })
      );
  }

  /** Backend Url et static dir ??*/
  backendUrl() {
    return `${AppConfig.API_ENDPOINT}`;
  }

  urlApplication() {
    return `${AppConfig.URL_APPLICATION}`
  }

  /** Backend Module Url */
  backendModuleUrl() {
    return `${AppConfig.API_ENDPOINT}/${ModuleConfig.MODULE_URL}`;
  }

  /** Frontend Module Monitoring Url */
  frontendModuleMonitoringUrl() {
    return ModuleConfig.MODULE_URL;
  }

  moduleMonitoringCode() {
    return ModuleConfig.MODULE_CODE;
  }

  /** Config Object Schema */
  schema(moduleCode, objectType, typeSchema = 'all'): Object {
    moduleCode = moduleCode || 'generic';

    const configObject = this._config[moduleCode][objectType];

    // patch media TODO fix
    if (!configObject) {
      return {};
    }

    switch (typeSchema) {
      case 'all': {
        return { ...configObject.generic, ...configObject.specific };
      }
      case 'generic': {
        return configObject.generic;
      }
      case 'specific': {
        return configObject.specific;
      }
    }
  }

  /**
   * Renvoie un element de configuration d'un objet pour un module donné
   *
   * ex: getconfigModuleObjectParam('objects', 'oedic', 'site', 'descrition_field_name') renvoie 'base_site_name'
   */
  configModuleObjectParam(moduleCode: string, objectType: string, fieldName: string) {
    moduleCode = moduleCode || 'generic';
    const confObject = this._config[moduleCode][objectType];
    return confObject ? confObject[fieldName] : null;
  }

  /** config data : pour initialiser les données Nomenclature, Taxons, Users,...
   * contient une liste de type de nomenclature, les liste d'utilisateur et une liste de taxon
  */
  configData(moduleCode) {
    return this._config[moduleCode]['data'];
  }

  frontendParams() {
    return this._config.frontendParams;
  }

  setFrontendParams(paramName, paramValue) {
    if (this._config && this._config.frontendParams) {
      this._config.frontendParams[paramName] = paramValue;
    }
  }

  config() {
    return this._config;
  }


  cache() {
    return this._config;
  }


}
