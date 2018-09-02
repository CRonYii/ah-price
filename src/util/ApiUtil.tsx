import { DataResource } from "../entity/DataResource";
import { chromeStorage } from "./ChromeStorage";

export enum HostOption {
    Region = 'region',
    Language = 'language'
}

export interface ApiOption {
    hostOption: HostOption,
    useRealm?: boolean
}

export class ApiUtil {

    static getRealmList() {
        return ApiUtil.requestEndpoint('wow/realm/status', { hostOption: HostOption.Region })
            .then(({ realms }) => realms.map(realm => ({
                name: realm.name,
                value: realm.slug
            })))
            .then(realms => {
                chromeStorage.setItems({ realms });
            });
    }

    static getAuction() {
        return ApiUtil.requestEndpoint('wow/auction/data', { hostOption: HostOption.Region, useRealm: true })
            .then(json => json.files[0].url)
            .then(url =>
                fetch(url)
                    .then(res => res.json())
                    .then(console.log)
            );
    }

    static requestEndpoint(endpoint: string, option: ApiOption) {
        const { hostOption, useRealm } = option;
        const { locale, apiKey, realm, region } = chromeStorage.getItems();
        if (apiKey === "") {
            return Promise.reject(new Error("API key is not set."));
        } else if (useRealm && realm === "") {
            return Promise.reject(new Error("Realm is not set."));
        }
        const host = hostOption === HostOption.Language ? DataResource.getHost(locale) : region;
        const link: string = ApiUtil.makeUrlWithQueryParams(`${host}${endpoint}${useRealm ? `/${realm}` : ''}`, {
            locale: hostOption === HostOption.Region ? DataResource.getHostByLocale(region, locale) : locale,
            apiKey
        });

        return fetch(link)
            .then(res => {
                switch (res.status) {
                    case 200: return res.json();
                    case 403: return Promise.reject(new Error('Invalid Api Key.'));
                    case 404: return Promise.reject(new Error('Requested data not found.'));
                    default: return Promise.reject(new Error('Api Request Failed.'));
                }
            });
    }

    static makeUrlWithQueryParams(link: string, params: any) {
        link += '?';
        let firstParam = true;
        for (let key in params) {
            if (!firstParam) {
                link += '&';
            } else {
                firstParam = false;
            }
            link += `${key}=${params[key]}`;
        }
        return link;
    }

}