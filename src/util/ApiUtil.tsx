import { DataResource } from "../entity/DataResource";
import { ChromeStorage, chromeStorage } from "./ChromeStorage";
import { message } from "antd";

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
                chromeStorage.setItems({ realms }, ChromeStorage.localStorage);
            });
    }

    static getItemData(itemId) {
        return ApiUtil.requestEndpoint(`wow/item/${itemId}`, { hostOption: HostOption.Language})
            .then(console.log);
    }

    static getAuction() {
        return ApiUtil.requestEndpoint('wow/auction/data', { hostOption: HostOption.Region, useRealm: true })
            .then(json => json.files[0])
            .then(file => {
                    const { auctionData } = chromeStorage.getItems();
                    if (auctionData.lastModified != file.lastModified) {
                        chromeStorage.setItems({
                            auctionData: {
                                data: file.url,
                                lastModified: file.lastModified
                            }
                        }, ChromeStorage.localStorage);
                        return true;
                        // fetch(file.url)
                        //     .then(res => res.json())
                        //     .then(auctionData => {
                        //         chromeStorage.setItems({
                        //             auctionData: {
                        //                 data: auctionData,
                        //                 lastModified: file.lastModified
                        //             }
                        //         }, ChromeStorage.localStorage);
                        //     });
                    } else {
                        return false
                    }
                }
            );
    }

    static requestEndpoint(endpoint: string, option: ApiOption) {
        const { hostOption, useRealm } = option;
        const { locale, apiKey, realm, region } = chromeStorage.getItems();
        if (apiKey === "") {
            const err = "API key is not set.";
            message.error(err);
            return Promise.reject(new Error(err));
        } else if (useRealm && realm === "") {
            const err = "Realm is not set.";
            message.error(err)
            return Promise.reject(new Error(err));
        }
        const host = hostOption === HostOption.Language ? DataResource.getHost(locale) : region;
        const link: string = ApiUtil.makeUrlWithQueryParams(`${host}${endpoint}${useRealm ? `/${realm}` : ''}`, {
            locale: hostOption === HostOption.Region ? DataResource.getHostByLocale(region, locale) : locale,
            apiKey
        });

        return fetch(link)
            .then(res => {
                switch (res.status) {
                    case 200:
                        return res.json();
                    case 403:
                        return Promise.reject(new Error('Invalid Api Key.'));
                    case 404:
                        return Promise.reject(new Error('Requested data not found.'));
                    default:
                        return Promise.reject(new Error('Api Request Failed.'));
                }
            })
            .catch((err) => {
                console.log(err);
                message.error(err.message);
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