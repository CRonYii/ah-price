import idb, { DB, UpgradeDB } from 'idb';
import { Store } from './store/Store';

export abstract class Database {

    public static createObjectStoreIfDoesNotExist = (upgradeDb: UpgradeDB, name: string, optionalParameters?: IDBObjectStoreParameters) => {
        if (!upgradeDb.objectStoreNames.contains(name)) {
            return upgradeDb.createObjectStore(name, optionalParameters);
        }
    }
    
    protected dbPromise: Promise<DB>;
    protected stores: Store[] = [];
    
    public constructor(name: string, version?: number) {
        this.dbPromise = idb.open(name, version, this.init);
    }
    
    private createObjectStore = (upgradeDb: UpgradeDB, store: Store) => {
        const objStore = Database.createObjectStoreIfDoesNotExist(upgradeDb, store.name, store.options);
        store.indexes.forEach(index => {
            objStore.createIndex(index.name, index.keyPath, index.optionalParameters);
        });
    }
    
    private init = (upgradeDb: UpgradeDB) => {
        this.stores.forEach(store => {
            this.createObjectStore(upgradeDb, store);
        });
    };
}