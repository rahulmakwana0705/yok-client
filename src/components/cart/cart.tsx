import Scrollbar from "@components/common/scrollbar";
import { useCart } from "@contexts/cart/cart.context";
import { motion } from "framer-motion";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { IoClose } from "react-icons/io5";
import CartItem from "./cart-item";
import EmptyCart from "./empty-cart";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";
import cn from "classnames";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
	const { t } = useTranslation("common");
	const { closeCart } = useUI();
	const { items, total, isEmpty } = useCart();
	const [validCoupons, setValidCoupons] = useState([]);
	const [couponCode, setCouponCode] = useState("");
	const [isCouponValid, setIsCouponValid] = useState(false);
	// const [discountAmount, setDiscountAmount] = useState(0);

	const { addDiscountToState } = useCart();

	const handleCouponCodeChange = (e) => {
		console.log("Coupon Code :: ", e.target.value);
		setCouponCode(e.target.value);
		setIsCouponValid(false);
	};

	const getAllValidCouponsHandler = async () => {
		try {
			const response = await axios.get("/api/coupons/get");
			console.log("Valid Coupons Response :: ", response.data.coupons);
			setValidCoupons(response.data.coupons);
		} catch (error) {
			console.log("Error while getting valid coupons :: ", error);
		}
	};

	useEffect(() => {
		getAllValidCouponsHandler();
	}, []);

	// const [items, setItems] = useState(null);
	// const [total, settotal] = useState(null);
	// const [isEmpty, setIsEmpty] = useState(null);
	const { price: cartTotal } = usePrice({
		amount: total,
		currencyCode: "USD",
	});

	const [totalAmount, setTotalAmount] = useState(cartTotal);
	// useEffect(() => {

	//   const loadCartData = async () => {
	//     try {
	//       const response = await axios.get("/api/add-to-cart/get");
	//       console.log("response cart", response);
	//       setItems(response?.data?.cartItems);
	//       settotal(response?.data?.cartItems.length);
	//       setIsEmpty(false);
	//     } catch (error) {
	//       console.log("error on get cart", error);
	//     }
	//   };
	//   loadCartData();
	// }, []);

	function convertCurrencyStringToNumber(currencyString) {
		// Remove the currency symbol ($) and commas (,) from the string
		const cleanedString = currencyString.replace(/[$,]/g, "");

		// Parse the cleaned string as a float
		const number = parseFloat(cleanedString);

		return number;
	}

	function convertNumberToCurrencyString(number) {
		const currencyString = number.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});

		return currencyString;
	}

	function isValidCoupon(couponCode: string) {
		const result = validCoupons.some((coupon: any) => {
			return coupon?.name === couponCode;
		});
		setIsCouponValid(result);
		if (result === false) {
			setCouponCode("Invalid Coupon Code");
			return;
		}

		const coupon: any = validCoupons.find(
			(coupon: any) => coupon.name === couponCode
		);

		let discountAmount = 0;

		if (coupon) {
			if (coupon.type === "percentage") {
				discountAmount = (coupon.discount / 100) * total;
			} else {
				discountAmount = coupon.discount;
			}
		}

		addDiscountToState(discountAmount);

		const remainingAmount = convertNumberToCurrencyString(
			total - discountAmount
		);

		console.log("remainingAmount :: ", remainingAmount);
		setTotalAmount(remainingAmount);
	}

	return (
		<div className="flex flex-col justify-between w-full h-full">
			<div className="w-full flex justify-between items-center relative ltr:pl-5 ltr:md:pl-7 rtl:pr-5 rtl:md:pr-7 py-0.5 border-b border-gray-100">
				<h2 className="m-0 text-xl font-bold md:text-2xl text-heading">
					{/* @ts-ignore */}
					{t("text-shopping-cart")}
				</h2>
				<button
					className="flex items-center justify-center px-4 py-6 text-2xl text-gray-500 transition-opacity md:px-6 lg:py-8 focus:outline-none hover:opacity-60"
					onClick={closeCart}
					aria-label="close"
				>
					<IoClose className="text-black mt-1 md:mt-0.5" />
				</button>
			</div>
			{!isEmpty ? (
				<Scrollbar className="flex-grow w-full cart-scrollbar">
					<div className="w-full px-5 md:px-7">
						{items?.map((item) => (
							<CartItem item={item} key={item.id} />
						))}
					</div>
				</Scrollbar>
			) : (
				<motion.div
					layout
					initial="from"
					animate="to"
					exit="from"
					variants={fadeInOut(0.25)}
					className="flex flex-col items-center justify-center px-5 pt-8 pb-5 md:px-7"
				>
					<EmptyCart />
					<h3 className="pt-8 text-lg font-bold text-heading">
						{/* @ts-ignore */}
						{t("text-empty-cart")}
					</h3>
				</motion.div>
			)}

			<div className="flex flex-col px-5 pt-2 pb-5 md:px-7 md:pb-7 gap-2">
				{isEmpty === false && (
					<div
						className={cn(
							"w-full px-5 py-2 flex items-center justify-center rounded-md text-sm sm:text-base text-white focus:outline-none transition duration-300 ",
							isEmpty
								? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
								: "bg-heading hover:bg-gray-600"
						)}
					>
						<input
							type="text"
							placeholder="Coupon Code"
							onChange={handleCouponCodeChange}
							value={couponCode}
							className="bg-inherit font-medium text-white placeholder:text-white outline-none rounded-l-md w-2/3 py-2"
						/>
						<button
							onClick={() => isValidCoupon(couponCode)}
							className="flex justify-center items-center w-1/3 py-2 bg-blue-900 rounded-md font-semibold"
						>
							<span>{!isCouponValid ? "Apply" : "Applied"}</span>
						</button>
					</div>
				)}
				<Link
					href={isEmpty === false ? ROUTES.CHECKOUT : "/"}
					className={cn(
						"w-full px-5 py-3 md:py-4 flex items-center justify-center rounded-md text-sm sm:text-base text-white focus:outline-none transition duration-300 ",
						isEmpty
							? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
							: "bg-heading hover:bg-gray-600"
					)}
				>
					<span className="w-full ltr:pr-5 rtl:pl-5 -mt-0.5 py-0.5">
						{/* @ts-ignore */}
						{t("text-proceed-to-checkout")}
					</span>
					<span className="rtl:mr-auto ltr:ml-auto flex-shrink-0 -mt-0.5 py-0.5 flex">
						<span className="ltr:border-l rtl:border-r border-white ltr:pr-5 rtl:pl-5 py-0.5" />
						{isCouponValid ? totalAmount : cartTotal}
					</span>
				</Link>
			</div>
		</div>
	);
}
