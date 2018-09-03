import { Store } from "./Store";

export class AuctionStore extends Store {

    static itemIndex = {
        name: 'item-index',
        keyPath: 'item',
        optionalParameters: {
            unique: false
        }
    };

    name = 'auction';

    options = {
        keyPath: 'auc',
        autoIncrement: false
    };

    indexes = [AuctionStore.itemIndex];

    public addAuctionItems = (items: any[]) => {
        return this.addItems(items);
    }

    public clearAuctions = () => {
        return this.deleteAll();
    }

    public getItemsById = (id) => {
        return this.getIndexedItems(AuctionStore.itemIndex.name, id);
    }
}