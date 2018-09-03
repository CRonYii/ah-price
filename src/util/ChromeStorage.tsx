import { ApiLocale, Host, AuctionData } from "../entity/DataResource";
import { Realm } from "../component/RealmSelect";
import StorageArea = chrome.storage.StorageArea;
import { message } from 'antd';
import { UIData } from "../entity/UIData";

export interface StorageMember {
    apiKey?: string,
    locale?: ApiLocale,
    region?: Host,
    realm?: string,
    realms?: Array<Realm>,
    auctionData?: AuctionData,
    uiData?: UIData,
}

export class Storage {

    public apiKey = "";
    public locale = ApiLocale.EnglishUS;
    public region = Host.US;
    public realm = "";
    public realms = [];
    public auctionData: AuctionData = new AuctionData();
    public uiData: UIData = new UIData();

    setItems(items: StorageMember) {
        for (let key in items) {
            this[key] = items[key];
        }
    }

}

export class ChromeStorage {

    public static readonly localStorage: StorageArea = chrome.storage.local;
    public static readonly syncStorage: StorageArea = chrome.storage.sync;
    public static readonly runtimeStorage: StorageArea = null;

    private storage: Storage = new Storage();
    private numSubscribes: number = 0;
    private subscriberMap: Map<number, (storage: ChromeStorage) => any> = new Map();

    constructor() {
        const local = this.getStorage(ChromeStorage.localStorage);
        const sync = this.getStorage(ChromeStorage.syncStorage);
        Promise.all([local, sync])
            .then((storages: Array<any>) => {
                return storages.reduce((prev, current) => {
                    return Object.assign(prev, current);
                }, {});
            })
            .then((items) => {
                this.storage.setItems(items);
                this.subscriberMap.forEach((subscriber) => {
                    subscriber(this);
                });
            });
    }

    public subscribe = (func: (storage: ChromeStorage) => any) => {
        const id = this.numSubscribes;
        this.subscriberMap.set(id, func);
        this.numSubscribes += 1;

        return () => {
            this.subscriberMap.delete(id);
        };
    };

    private getStorage = (storingArea: StorageArea) => {
        return new Promise((resolve) => {
            storingArea.get(null, (items) => {
                resolve(items);
            });
        });
    };

    public setItems = (param: any, storageArea = ChromeStorage.syncStorage) => {
        let items = {};
        if (typeof param === 'function') {
            items = param(this.storage);
        } else {
            items = param;
        }
        this.storage.setItems(items);
        this.subscriberMap.forEach((subscriber) => {
            subscriber(this);
        });
        if (storageArea === ChromeStorage.runtimeStorage) {
            return Promise.resolve('');
        } else {
                return new Promise((resolve, reject) => {
                    storageArea.set(items, () => {
                        const error = chrome.runtime.lastError;
                        if (error) {
                            message.error('Unable to save data to chrome storage. ');
                            reject({ items, error });
                        }
                        resolve();
                    })
                });
        }
    };

    public getItems = () => {
        return this.storage;
    };

    public clearAllStorage = () => {
        const local = this.clearStorage(ChromeStorage.localStorage);
        const sync = this.clearStorage(ChromeStorage.syncStorage);
        return Promise.all([local, sync]);
    };

    public clearStorage = (storageArea: StorageArea) => {
        return new Promise(resolve => {
            storageArea.clear(resolve);
        });
    };

}

export const chromeStorage = new ChromeStorage();
chromeStorage.subscribe((storage) => {
    console.log(storage.getItems());
});