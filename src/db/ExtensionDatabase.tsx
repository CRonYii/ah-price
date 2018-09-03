import { Database } from "./Database";
import { AuctionStore } from "./store/AuctionStore";
import { Store } from "./store/Store";

export class ExtensionDatabase extends Database {

    public static readonly dBName = 'extension';
    public static readonly versoinNumber = 1;

    public auctionStore = new AuctionStore(this.dbPromise);

    protected stores: Store[] = [this.auctionStore];

    constructor() {
        super(ExtensionDatabase.dBName, ExtensionDatabase.versoinNumber);
    }

}

export const extensionDatabase = new ExtensionDatabase();