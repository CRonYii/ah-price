import * as React from 'react';
import { ChromeStorage, chromeStorage, Storage } from './ChromeStorage';

const Context = React.createContext(chromeStorage);

export interface ChromeStorageProviderProps {
    storage: ChromeStorage
}

export class ChromeStorageProvider extends React.Component<ChromeStorageProviderProps> {
    render() {
        return <Context.Provider value={this.props.storage}>
            {this.props.children}
        </Context.Provider>
    }
}

function provideStorage(Component) {
    return class ChromeStorageConsumer extends React.Component {
        render() {
            return <Context.Consumer>
                {chromeStorage => {
                    return <Component storage={chromeStorage} {...this.props} />
                }}
            </Context.Consumer>;
        }
    }
}

export function connectStorage(mapStorageToProps: (storage: ChromeStorage, items: Storage, ownProps: any) => any) {
    return (Component) => {
        return provideStorage(class ChromeStorageMappedConsumer extends React.Component<ChromeStorageProviderProps> {

            private unsubscribe: () => void;
            private lastStorageProps: any;
            
            render() {
                this.lastStorageProps = mapStorageToProps(this.props.storage, this.props.storage.getItems(), this.props);
                return <Component {...this.props} {...this.lastStorageProps} />;
            }

            handleChange = (storage) => {
                if (this.shouldForceUpdate(this.lastStorageProps, mapStorageToProps(storage, storage.getItems(), this.props))) {
                    this.forceUpdate();
                }
            }

            shouldForceUpdate = (last, current): boolean => {
                for (let key in last) {
                    if (typeof last[key] !== 'function') {
                        if (last[key] !== current[key]) {
                            return true;
                        }
                    }
                }
                return false;
            }

            componentDidMount() {
                this.unsubscribe = this.props.storage.subscribe(this.handleChange);
            }

            componentWillUnmount() {
                this.unsubscribe();
            }

        })
    };
}

