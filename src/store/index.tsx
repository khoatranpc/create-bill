import { createContext } from "react";

export interface InterfaceStoreContext {
    listProduct: any,
    dispatch: (action: { type: string, payload: any }) => void;
}
export const initStoreContext: InterfaceStoreContext = {
    listProduct: null,
    dispatch() { }
}
const StoreContext = createContext<InterfaceStoreContext>(initStoreContext);

export default StoreContext;