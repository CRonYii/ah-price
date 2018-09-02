import { ApiLocale, Host } from "../entity/DataResource";
import { Realm } from "../component/RealmSelect";

export interface StorageMember {
    apiKey?: string,
    locale?: ApiLocale,
    region?: Host,
    realm?: string,
    relalms?: Array<Realm>
}

export class Storage {

    public apiKey = "";
    public locale = ApiLocale.EnglishUS;
    public region = Host.US;
    public realm = "";
    public realms = [];

    setItems(items: StorageMember) {
        for (let key in items) {
            this[key] = items[key];
        }
    }

}

export class ChromeStorage {

    private storage: Storage = new Storage();
    private numSubscribes: number = 0;
    private subscriberMap: Map<number, (storage: ChromeStorage) => any> = new Map();

    constructor() {
        this.getStorage()
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
    }

    private getStorage = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(null, (items) => {
                resolve(items);
            });
        })
    }

    public setItems = (param: any) => {
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
        return new Promise((resolve) => {
            chrome.storage.sync.set(items, resolve)
        });
    }

    public getItems = () => {
        return this.storage;
    }

}

export const chromeStorage = new ChromeStorage();