import { Database } from "../Database";
import { DB } from "idb";

export interface Index {
    name: string,
    keyPath: string | string[],
    optionalParameters?: IDBIndexParameters
}

export class Store {

    public name: string;
    public options: IDBObjectStoreParameters;
    public indexes: Index[];

    protected dbPromise: Promise<DB>;

    public constructor(dbPromise: Promise<DB>) {
        this.dbPromise = dbPromise;
    }

    protected getStore = () => {
        return this.dbPromise.then(db => {
            const transaction = db.transaction(this.name, 'readwrite');
            const store = transaction.objectStore(this.name);
            return { transaction, store };
        });
    };

    protected addItems = (items: any[]) => {
        return this.getStore()
            .then(({ transaction, store }) => {
                items.forEach(item => {
                    store.add(item);
                })
                return transaction.complete
            })
    };

    protected readItems = (primaryKeys: any[]) => {
        return this.getStore()
            .then(({ store }) => {
                primaryKeys.forEach(primaryKey => {
                    return store.get(primaryKey);
                });
            });
    }

    protected updateItems = (items: any[]) => {
        return this.getStore()
            .then(({ transaction, store }) => {
                items.forEach(({item, primaryKey}) => {
                    store.put(item, primaryKey);
                });
                return transaction.complete;
            });
    }

    protected deleteItems = (primaryKeys) => {
        return this.getStore()
            .then(({ transaction, store }) => {
                primaryKeys.forEach(primaryKey => {
                    store.delete(primaryKey);
                });
                return transaction.complete;
            });
    }

    protected deleteAll = () => {
        return this.getStore()
            .then(({ store }) => {
                return store.clear();
            });
    }

    protected getItems = (options) => {
        return this.getStore()
            .then(({ store }) => {
                return store.getAll(options);
            });
    }

    protected getIndexedItems = (indexName, rule) => {
        const valueArray = [];
        return this.getStore()
            .then(({ store }) => {
                return store.index(indexName).openCursor(rule);
            })
            .then(function getValue(cursor) {
                if (!cursor) return valueArray;
                valueArray.push(cursor.value);
                return cursor.continue().then(getValue);
            });
    }
}