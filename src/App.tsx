import { useReducer } from 'react';
import './App.scss';
import StoreContext, { InterfaceStoreContext, initStoreContext } from './store';
import CreateBill from './components/CreateBill';
import { STORE_LIST_PRODUCT } from './store/type';

const handleState = (state: InterfaceStoreContext, action: { type: string, payload: any }) => {
  switch (action.type) {
    case STORE_LIST_PRODUCT:
      return {
        ...state,
        listProduct: action.payload
      }
    default:
      break;
  }
}

function App() {
  const [data, dispatch] = useReducer<any>(handleState, initStoreContext);
  return (
    <StoreContext.Provider value={{ ...(data as any), dispatch }}>
      <div className="appContainer">
        <CreateBill />
      </div>
    </StoreContext.Provider>
  )
}

export default App
