import React from "react";
import { cartReducer, State, initialState } from "./cart.reducer";
import { Item, getItem } from "./cart.utils";
import { useLocalStorage } from "@utils/use-local-storage";
interface CartProviderState extends State {
	addItemToCart: (item: Item, quantity: number) => void;
	removeItemFromCart: (id: Item["id"]) => void;
	// updateItem: (id: Item["id"], payload: object) => void;
	// updateItemQuantity: (id: Item["id"], quantity: number) => void;
	clearItemFromCart: (id: Item["id"]) => void;
	getItemFromCart: (id: Item["id"]) => any | undefined;
	addDiscountToState: (amount: number) => any;
	isInCart: (id: Item["id"]) => boolean;
	// updateCartMetadata: (metadata: Metadata) => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
	undefined
);

cartContext.displayName = "CartContext";

export const useCart = () => {
	const context = React.useContext(cartContext);
	if (context === undefined) {
		throw new Error(`useCart must be used within a CartProvider`);
	}
	return context;
};

export const CartProvider: React.FC = (props) => {
	const [savedCart, saveCart] = useLocalStorage(
		`chawkbazar-cart`,
		JSON.stringify(initialState)
	);
	console.log("Saved Cart:", savedCart); // Log saved cart value
	const [state, dispatch] = React.useReducer(
		cartReducer,
		JSON.parse(savedCart!)
	);
	// React.useEffect(() => {
	//   saveCart(JSON.stringify(state));
	// }, [state, saveCart]);

	const addItemToCart = (item: Item, quantity: number) =>
		dispatch({ type: "ADD_ITEM_WITH_QUANTITY", item, quantity });
	const removeItemFromCart = (id: Item["_id"]) =>
		dispatch({ type: "REMOVE_ITEM_OR_QUANTITY", id });
	const clearItemFromCart = (id: Item["_id"]) =>
		dispatch({ type: "REMOVE_ITEM", id });
	const addDiscountToState = (amount: number) => {
		dispatch({ type: "SET_DISCOUNT_AMOUNT", amount });
	};
	const isInCart = (id: Item["_id"]) => !!getItem(state.items, id);
	const getItemFromCart = (id: Item["_id"]) => getItem(state.items, id);
	// const inStock=()=>{}
	const value = React.useMemo(
		() => ({
			...state,
			addItemToCart,
			removeItemFromCart,
			clearItemFromCart,
			getItemFromCart,
			addDiscountToState,
			isInCart,
		}),
		[state]
	);
	return <cartContext.Provider value={value} {...props} />;
};
