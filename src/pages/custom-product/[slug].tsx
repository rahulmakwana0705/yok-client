import React, { useEffect, useState } from "react";
import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import ProductSingleDetails from "@components/product/product-single-details";
import RelatedProducts from "@containers/related-products";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useRouter } from "next/router";
import { useProductQuery } from "@framework/product/get-product";
import { getVariations } from "@framework/utils/get-variations";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import isEmpty from "lodash/isEmpty";
import Link from "@components/ui/link";
import { toast } from "react-toastify";
import { useWindowSize } from "@utils/use-window-size";
import Carousel from "@components/ui/carousel/carousel";
import { SwiperSlide } from "swiper/react";
import ProductMetaReview from "@components/product/product-meta-review";
import { useSsrCompatible } from "@utils/use-ssr-compatible";
import { CheckBox } from "@components/ui/checkbox";

import cn from "classnames";
import axios from "axios";
import Cookies from "js-cookie";
import { useUI } from "@contexts/ui.context";

const productGalleryCarouselResponsive = {
	"768": {
		slidesPerView: 2,
		slidesPerGroupSkip: 1,
	},
	"0": {
		slidesPerView: 1,
		slidesPerGroupSkip: 1,
	},
};

const dataa = {
	id: 1,
	sku: "N/A",
	name: "Maniac Red Boys",
	slug: "maniac-red-boys",
	description:
		"Children’s clothing/ kids wear is usually more casual than adult clothing, fit play and rest. Hosiery is usually used. More recently, however, tons of childrenswear is heavily influenced by trends in adult fashion",
	category: {
		id: 1,
		name: "kids",
		slug: "kids",
	},
	tags: [
		{
			id: 1,
			name: "Casual",
			slug: "casual",
		},
		{
			id: 2,
			name: "Cotton",
			slug: "cotton",
		},
		{
			id: 3,
			name: "Red",
			slug: "red",
		},
	],
	image: {
		id: 1,
		thumbnail: "/assets/images/products/p-20.png",
		original: "/assets/images/products/p-20-m.png",
	},
	gallery: [
		{
			id: 1,
			thumbnail:
				"https://m.media-amazon.com/images/I/61ckXdPNKTL._SY741_.jpg",
			original:
				"https://m.media-amazon.com/images/I/61ckXdPNKTL._SY741_.jpg",
		},
		{
			id: 2,
			thumbnail:
				"https://m.media-amazon.com/images/I/61wrWvif-vL._SY741_.jpg",
			original:
				"https://m.media-amazon.com/images/I/61wrWvif-vL._SY741_.jpg",
		},
		//   {
		// 	"id": 3,
		// 	"thumbnail": "/assets/images/products/p-20-3.png",
		// 	"original": "/assets/images/products/p-20-3.png"
		//   },
		//   {
		// 	"id": 4,
		// 	"thumbnail": "/assets/images/products/p-20-4.png",
		// 	"original": "/assets/images/products/p-20-4.png"
		//   }
	],
	price: 50,
	sale_price: 40,
	quantity: 20,
	variations: [
		{
			id: 1,
			value: "S",
			attribute: {
				id: 1,
				name: "Size",
				slug: "size",
			},
		},
		{
			id: 2,
			value: "M",
			attribute: {
				id: 1,
				name: "Size",
				slug: "size",
			},
		},
		{
			id: 3,
			value: "L",
			attribute: {
				id: 1,
				name: "Size",
				slug: "size",
			},
		},
		{
			id: 4,
			value: "XL",
			attribute: {
				id: 1,
				name: "Size",
				slug: "size",
			},
		},
		{
			id: 5,
			value: "Orange",
			meta: "#e86c25",
			attribute: {
				id: 1,
				name: "Color",
				slug: "color",
			},
		},
		{
			id: 6,
			value: "Pink",
			meta: "#ffa5b4",
			attribute: {
				id: 1,
				name: "Color",
				slug: "color",
			},
		},
		{
			id: 7,
			value: "Purple",
			meta: "#8224e3",
			attribute: {
				id: 1,
				name: "Color",
				slug: "color",
			},
		},
		{
			id: 8,
			value: "Red",
			meta: "#dd3333",
			attribute: {
				id: 1,
				name: "Color",
				slug: "color",
			},
		},
	],
	meta: [
		{
			id: 1,
			title: "Product Details",
			content:
				"Our Customer Experience Team is available 7 days a week and we offer 2 ways to get in contact.Email and Chat . We try to reply quickly, so you need not to wait too long for a response!.",
		},
		{
			id: 2,
			title: "Additional Information",
			content:
				"Please read the documentation carefully . We also have some online video tutorials regarding this issue . If the problem remains, Please Open a ticket in the support forum",
		},
		{
			id: 3,
			title: "Customer Reviews",
			content:
				"At first, Please check your internet connection . We also have some online video tutorials regarding this issue . If the problem remains, Please Open a ticket in the support forum.",
		},
	],
};

var userData;
const authToken = Cookies.get("token");

if (authToken) {
	userData = JSON.parse(authToken);
	console.log("userData", userData);
}

export default function ProductPage() {
	const {
		query: { slug },
	} = useRouter();

	const [nameHolder, setNameHolder] = useState("");

	const { openSearch, openModal, setModalView, isAuthorized } = useUI();

	const [data, setData] = useState(dataa);
	const { width } = useSsrCompatible(useWindowSize(), {
		width: 0,
		height: 0,
	});

	const { isLoading } = useProductQuery(slug as string);
	const { addItemToCart } = useCart();
	const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
	const [selectedOption, setSelectedOption] = useState<string>("");
	const [imageGallery, setImageGallery] = useState("");

	const [quantity, setQuantity] = useState(1);
	const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
	const [customizeTshirt, setCustomizeTshirt] = useState<boolean>(false);
	const [selectedSide, setSelectedSide] = useState<string>("");
	const [customizationType, setCustomizationType] = useState<string>("");
	const [customizePolos, setCustomizePolos] = useState<string>("");
	const [customizeBasics, setCustomizeBasics] = useState<string>("");
	const [checkedBox, setCheckedBox] = useState("null");
	const [selectedColor, setSelectedColor] = useState("");
	const [isOptionSelected, setIsOptionSelected] = useState(false);

	const [uploadedImageUrl, setUploadedImageUrl] = useState("");

	useEffect(() => {
		const loadCartData = async () => {
			try {
				const response = await axios.post(`/api/product/get-single`, {
					slug,
				});
				console.log("response product hahj", response);
				setData(response?.data);
				console.log("Response Data :: ", response.data);
				setImageGallery(response.data.gallery);
			} catch (error) {
				console.log("error on get cart", error);
			}
		};
		if (slug) {
			loadCartData();
		}
	}, [slug]);

	useEffect(() => {
		if (nameHolder || uploadedImageUrl) {
			setIsOptionSelected(true);
		} else {
			setIsOptionSelected(false);
		}
	}, [nameHolder, uploadedImageUrl]);

	const handleImageUpload = (files) => {
		// console.log("Image selected:", files);
		const uploadedImage = files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			setUploadedImageUrl(event.target.result);
		};

		reader.readAsDataURL(uploadedImage);
	};

	console.log("uploadedImageUrl", uploadedImageUrl);

	const { price, basePrice, discount } = usePrice(
		data && {
			amount: data.sale_price ? data.sale_price : data.price,
			baseAmount: data.price,
			currencyCode: "USD",
		}
	);

	if (isLoading) return <p>Loading...</p>;
	const variations = getVariations(data?.variations);

	const isSelected = !isEmpty(variations)
		? !isEmpty(attributes) &&
		  Object.keys(variations).every((variation) =>
				attributes.hasOwnProperty(variation)
		  )
		: true;

	const createCustomProductHandler = async () => {
		try {
			const formData = new FormData();
			formData.append("name", nameHolder);
			formData.append("image", uploadedImageUrl);
			formData.append("userId", userData?._id);
			formData.append("color", selectedColor);
			formData.append("side", checkedBox);
			formData.append("customizationType", customizationType);
			formData.append("customizePolos", customizePolos);
			formData.append("customizeBasics", customizeBasics);
			const response = await axios.post(
				"/api/product/custom/create",
				formData
			);
			// Assuming your API returns the created custom product in the response
			console.log("Custom product created successfully:", response);
		} catch (error) {
			console.log("Error while creating custom product:", error);
		}
	};

	function addToCart() {
		if (!isSelected) return;
		// to show btn feedback while product carting
		if (!userData) {
			setModalView("LOGIN_VIEW");
			return openModal();
		}
		setAddToCartLoader(true);
		setTimeout(() => {
			setAddToCartLoader(false);
		}, 600);

		const item = generateCartItem(data!, attributes);
		addItemToCart(item, quantity);
		toast("Added to the bag", {
			progressClassName: "fancy-progress-bar",
			position: width > 768 ? "bottom-right" : "top-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		});

		console.log("item", item);
		console.log("quantity", quantity);

		fetch(
			`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/add-to-cart/create`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userData?._id,
					slug: slug,
					productId: data?._id,
					name: item?.name,
					image: item?.image,
					price: item?.price,
					quantity,
					attributes: {
						size: item?.attributes?.size,
						color: item?.attributes?.color,
					},
					itemTotal: quantity * item.price,
				}),
			}
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to add item to cart");
				}
			})
			.catch((error) => {
				console.error("Error adding item to cart:", error);
			});

		console.log(item, "item");
		createCustomProductHandler();
	}

	function handleAttribute(attribute: any) {
		setAttributes((prev) => ({
			...prev,
			...attribute,
		}));
	}

	const handleTshirtStyleClick = () => {
		setCustomizeTshirt(!customizeTshirt);
	};

	const handleSelectChange = (e) => {
		setSelectedOption(e.target.value);
	};

	const handleSideChange = (e) => {
		setSelectedSide(e.target.value);
	};

	const handleCustomizePolosChange = (option: string) => {
		// Toggle the customization option based on the checkbox selection
		setCustomizePolos((prevOptions) =>
			prevOptions === option ? "" : option
		);
	};

	const handleCustomizeBasicsChange = (option: string) => {
		// Toggle the customization option based on the checkbox selection
		setCustomizeBasics((prevOptions) =>
			prevOptions === option ? "" : option
		);
	};

	const renderInputFields = () => {
		if (selectedOption === "name") {
			return (
				<div>
					<h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
						Add Name
					</h3>
					<input
						type="text"
						className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
						onChange={(e) => handleImageUpload(e.target.files)}
					/>
				</div>
			);
		} else if (selectedOption === "image") {
			return (
				<div>
					<h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
						Upload Image
					</h3>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => handleImageUpload(e.target.files)}
					/>
				</div>
			);
		}

		return null;
	};

	const handleCheckBoxChage = (inboxValue) => {
		if (checkedBox === inboxValue) {
			setCheckedBox("");
		} else {
			setCheckedBox(inboxValue);
		}
	};

	const handleColorChange = (color) => {
		if (selectedColor === color) {
			setSelectedColor("");
		} else {
			setSelectedColor(color);
		}
	};

	const handleCheckboxChange = (type: string) => {
		// Toggle the customization type based on the checkbox selection
		setCustomizationType((prevType) => (prevType === type ? "" : type));
	};

	return (
		<>
			<Divider className="mb-0" />
			<Container>
				<div className="pt-8">
					<Breadcrumb />
				</div>
				{/* <ProductSingleDetails /> */}
				{/* <RelatedProducts sectionHeading="text-related-products" /> */}
				{/* <Subscription /> */}
				<div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start">
					{/* {width < 1025 ? (
            <Carousel
              pagination={{
                clickable: true,
              }}
              breakpoints={productGalleryCarouselResponsive}
              className="product-gallery"
              buttonGroupClassName="hidden"
            >
              {data?.gallery?.map((item, index: number) => (
                <SwiperSlide key={`product-gallery-key-${index}`}>
                  <div className="col-span-1 transition duration-150 ease-in hover:opacity-90">
                    <img
                      src={
                        item?.original ??
                        "/assets/placeholder/products/product-gallery.svg"
                      }
                      alt={`${data?.name}--${index}`}
                      className="object-cover w-full"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Carousel>
          ) : (
            <div className="col-span-4 grid gap-2.5">
              {data?.gallery?.map((item, index: number) => (
                <div
                  key={index}
                  className="col-span-1 transition duration-150 ease-in hover:opacity-90"
                >
                  <img
                    src={
                      item?.original ??
                      "/assets/placeholder/products/product-gallery.svg"
                    }
                    alt={`${data?.name}--${index}`}
                    className="object-cover w-full"
                  />
                </div>
              ))}
            </div>
          )} */}

					{width < 1025 ? (
						<Carousel
							pagination={{
								clickable: true,
							}}
							breakpoints={productGalleryCarouselResponsive}
							className="product-gallery"
							buttonGroupClassName="hidden"
						>
							<SwiperSlide>
								<div className="col-span-1 transition duration-150 ease-in hover:opacity-90">
									{checkedBox === "front" ? (
										<img
											src={
												// data?.gallery[0] &&
												// data?.gallery[0]?.original
												// 	? data?.gallery[0].original
												// 	: "/assets/placeholder/products/product-gallery.svg"
												selectedColor === "black"
													? "https://myawsproductsbucket.s3.ap-south-1.amazonaws.com/1712080240978-prod_product_images_CUS0001RNT-black-front.png"
													: "https://m.media-amazon.com/images/I/61ckXdPNKTL._SY741_.jpg"
											}
											alt={`${data?.name}--0`}
											className="object-cover w-full"
										/>
									) : (
										<img
											src={
												// data?.gallery &&
												// data?.gallery[1]?.original
												// 	? data.gallery[1].original
												// 	: "/assets/placeholder/products/product-gallery.svg"
												selectedColor === "black"
													? "https://myawsproductsbucket.s3.ap-south-1.amazonaws.com/1712080240971-prod_product_images_CUS0001RNT-black-back.png"
													: "https://m.media-amazon.com/images/I/61wrWvif-vL._SY741_.jpg"
											}
											alt={`${data?.name}--0`}
											className="object-cover w-full"
										/>
									)}
								</div>
								{uploadedImageUrl !== "" && (
									<div>
										<img
											src={uploadedImageUrl}
											alt="Uploaded Image"
											className="absolute inset-0 m-auto w-[30%] max-h-full"
											style={{ zIndex: 1 }}
										/>
									</div>
								)}
								<span
									className={`absolute inset-0 m-auto w-[30%] text-black h-12 text-center text-3xl font-bold ${
										selectedColor === "Black"
											? "text-white"
											: "text-black"
									}`}
								>
									{"nameHolder"}
								</span>
							</SwiperSlide>
						</Carousel>
					) : (
						<div className="col-span-4 grid gap-2.5 relative">
							<div className="col-span-1 transition duration-150 ease-in hover:opacity-90">
								{checkedBox === "front" ? (
									<img
										src={
											// data?.gallery &&
											// data?.gallery[0]?.original
											// 	? data.gallery[0].original
											// 	: "/assets/placeholder/products/product-gallery.svg"
											selectedColor === "Black"
												? "https://myawsproductsbucket.s3.ap-south-1.amazonaws.com/1712080240978-prod_product_images_CUS0001RNT-black-front.png"
												: "https://m.media-amazon.com/images/I/61ckXdPNKTL._SY741_.jpg"
										}
										alt={`${data?.name}--0`}
										className="object-cover w-full"
									/>
								) : (
									<img
										src={
											// data?.gallery[1] &&
											// data?.gallery[1]?.original
											// 	? data.gallery[1].original
											// 	: "/assets/placeholder/products/product-gallery.svg"
											selectedColor === "Black"
												? "https://myawsproductsbucket.s3.ap-south-1.amazonaws.com/1712080240971-prod_product_images_CUS0001RNT-black-back.png"
												: "https://m.media-amazon.com/images/I/61wrWvif-vL._SY741_.jpg"
										}
										alt={`${data?.name}--0`}
										className="object-cover w-full"
									/>
								)}

								{uploadedImageUrl !== "" && (
									<div>
										<img
											src={uploadedImageUrl}
											alt="Uploaded Image"
											className="absolute inset-0 m-auto w-[30%] max-h-full"
											style={{ zIndex: 1 }}
										/>
									</div>
								)}
								<span
									className={`absolute inset-0 m-auto w-[30%] text-black h-12 text-center text-3xl font-bold ${
										selectedColor === "Black"
											? "text-white"
											: "text-black"
									}`}
									style={{ zIndex: 1 }}
								>
									{nameHolder}
								</span>
							</div>
						</div>
					)}

					<div className="col-span-5 pt-8 lg:pt-0">
						<div className="pb-7 mb-7 border-b border-gray-300">
							<h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
								{data?.name}
							</h2>
							<p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
								{data?.description}
							</p>
							<div className="flex items-center mt-5">
								<div className="text-heading font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl ltr:pr-2 rtl:pl-2 ltr:md:pr-0 rtl:md:pl-0 ltr:lg:pr-2 rtl:lg:pl-2 ltr:2xl:pr-0 rtl:2xl:pl-0">
									{price}
								</div>
								{discount && (
									<span className="line-through font-segoe text-gray-400 text-sm md:text-base lg:text-lg xl:text-xl ltr:pl-2 rtl:pr-2">
										{basePrice}
									</span>
								)}
							</div>
						</div>

						<div className="pb-3 border-b border-gray-300 flex">
							{Object.keys(variations).map((variation) => {
								return (
									<div key={variation} className="mr-10">
										<h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
											{variation}
										</h3>
										<ul className="flex flex-wrap colors ltr:-mr-3 rtl:-ml-3">
											{variations[variation]?.map(
												({ id, value, meta }) => (
													<li
														key={`${value}-${id}`}
														className={cn(
															"cursor-pointer rounded border  w-9 md:w-11 h-9 md:h-11 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 ltr:md:mr-3 rtl:md:ml-3 flex justify-center items-center text-heading text-xs md:text-sm uppercase font-semibold transition duration-200 ease-in-out hover:border-black",
															value ===
																attributes[
																	variation
																]
																? "border-black"
																: "border-gray-100"
														)}
														onClick={() =>
															handleAttribute({
																[variation]:
																	value,
															})
														}
													>
														{variation ===
														"color" ? (
															<span
																className="block w-full h-full rounded"
																style={{
																	backgroundColor:
																		meta,
																}}
															/>
														) : (
															value
														)}
													</li>
												)
											)}
										</ul>
									</div>
								);
							})}
						</div>
						<div>
							<button
								onClick={handleTshirtStyleClick}
								className="mt-5 cursor-pointer text-base md:text-lg  font-semibold mb-2.5 capitalize bg-blue-950 text-white  px-3 py-2 rounded"
							>
								Design Your T-Shirt
							</button>
							{customizeTshirt && (
								<div className="pb-3 mt-4 border-b border-gray-300 ">
									<div className="mr-10 flex">
										<h3 className="text-base items-center mr-4 flex md:text-lg text-heading font-semibold mb-2.5 capitalize">
											Select Option
										</h3>
										<select
											value={selectedOption}
											onChange={handleSelectChange}
											className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
										>
											<option className="" value="">
												Select an option
											</option>
											<option value="name">
												Add Name
											</option>
											<option value="image">
												Upload Image
											</option>
										</select>
									</div>
									{selectedOption === "name" && (
										<div>
											<div className="mr-10 mt-4">
												<div className="flex gap-5 items-center ">
													<label
														htmlFor="name"
														className="text-base mt-3 md:text-lg text-heading font-semibold mb-2.5 capitalize"
													>
														Name
													</label>
													<input
														className="h-10 outline-none border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
														type="text"
														id="name"
														value={nameHolder}
														onChange={(e) =>
															setNameHolder(
																e.target.value
															)
														}
													/>
												</div>
												<div>
													<h3 className="text-base mt-3 md:text-lg text-heading font-semibold mb-2.5 capitalize">
														Choose Color
													</h3>
													<div className="flex">
														<div className="relative flex items-center mr-10">
															<CheckBox
																labelKey="Black"
																onChange={() =>
																	handleColorChange(
																		"Black"
																	)
																}
																checked={
																	selectedColor ===
																	"Black"
																}
															/>
														</div>
														<div className="relative flex items-center">
															<CheckBox
																labelKey="White"
																onChange={() =>
																	handleColorChange(
																		"White"
																	)
																}
																checked={
																	selectedColor ===
																	"White"
																}
															/>
														</div>
													</div>
												</div>
												<h3 className="text-base mt-3 md:text-lg text-heading font-semibold mb-2.5 capitalize">
													Type of Customization
												</h3>
												<div className="flex">
													<div className="relative flex items-center mr-10 ">
														<CheckBox
															labelKey="Print"
															checked={
																customizationType ===
																"Print"
															}
															onChange={() =>
																handleCheckboxChange(
																	"Print"
																)
															}
														/>
													</div>
													<div className="relative flex items-center ">
														<CheckBox
															labelKey="Embroidered"
															checked={
																customizationType ===
																"Embroidered"
															}
															onChange={() =>
																handleCheckboxChange(
																	"Embroidered"
																)
															}
														/>
													</div>
												</div>
											</div>

											<div className="mr-10 mt-4">
												<h3 className="text-base mt-3 md:text-lg text-heading font-semibold mb-2.5 capitalize">
													Customize Polos
												</h3>
												<div className="flex flex-wrap">
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Center"
																checked={
																	customizePolos ===
																	"Center"
																}
																onChange={() =>
																	handleCustomizePolosChange(
																		"Center"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Right Shoulder"
																checked={
																	customizePolos ===
																	"Right Shoulder"
																}
																onChange={() =>
																	handleCustomizePolosChange(
																		"Right Shoulder"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Left Shoulder"
																checked={
																	customizePolos ===
																	"Left Shoulder"
																}
																onChange={() =>
																	handleCustomizePolosChange(
																		"Left Shoulder"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Left Chest"
																checked={
																	customizePolos ===
																	"Left Chest"
																}
																onChange={() =>
																	handleCustomizePolosChange(
																		"Left Chest"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Right Chest"
																checked={
																	customizePolos ===
																	"Right Chest"
																}
																onChange={() =>
																	handleCustomizePolosChange(
																		"Right Chest"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Embroidered"
																checked={
																	customizePolos ===
																	"Embroidered"
																}
																onChange={() =>
																	handleCustomizePolosChange(
																		"Embroidered"
																	)
																}
															/>
														</div>
													</div>
												</div>
											</div>

											<div className="mr-10 mt-4">
												<h3 className="text-base mt-3 md:text-lg text-heading font-semibold mb-2.5 capitalize">
													Customize Basics
												</h3>
												<div className="flex flex-wrap">
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Center"
																checked={
																	customizeBasics ===
																	"Center"
																}
																onChange={() =>
																	handleCustomizeBasicsChange(
																		"Center"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Right Shoulder"
																checked={
																	customizeBasics ===
																	"Right Shoulder"
																}
																onChange={() =>
																	handleCustomizeBasicsChange(
																		"Right Shoulder"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Left Shoulder"
																checked={
																	customizeBasics ===
																	"Left Shoulder"
																}
																onChange={() =>
																	handleCustomizeBasicsChange(
																		"Left Shoulder"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Left Chest"
																checked={
																	customizeBasics ===
																	"Left Chest"
																}
																onChange={() =>
																	handleCustomizeBasicsChange(
																		"Left Chest"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Right Chest"
																checked={
																	customizeBasics ===
																	"Right Chest"
																}
																onChange={() =>
																	handleCustomizeBasicsChange(
																		"Right Chest"
																	)
																}
															/>
														</div>
													</div>
													<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 sm:mb-0">
														<div className="relative flex items-center">
															<CheckBox
																labelKey="Embroidered"
																checked={
																	customizeBasics ===
																	"Embroidered"
																}
																onChange={() =>
																	handleCustomizeBasicsChange(
																		"Embroidered"
																	)
																}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}
									{selectedOption === "image" && (
										<div>
											<div className="mr-10">
												<h3 className="text-base mt-3 md:text-lg text-heading font-semibold mb-2.5 capitalize">
													Select Side
												</h3>
												<div className="flex">
													<div className="relative flex items-center mr-10 ">
														<CheckBox
															labelKey="Front"
															onChange={() =>
																handleCheckBoxChage(
																	"front"
																)
															}
															checked={
																checkedBox ===
																"front"
															}
														/>
													</div>
													<div className="relative flex items-center ">
														<CheckBox
															labelKey="Back"
															onChange={() =>
																handleCheckBoxChage(
																	"back"
																)
															}
															checked={
																checkedBox ===
																"back"
															}
														/>
													</div>
												</div>
											</div>
											<div className="mt-3">
												<h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
													Upload Image
												</h3>
												<input
													type="file"
													accept="image/*"
													onChange={(e) =>
														handleImageUpload(
															e.target.files
														)
													}
												/>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
						<div className="flex items-center gap-x-4 ltr:md:pr-32 rtl:md:pl-32 ltr:lg:pr-12 rtl:lg:pl-12 ltr:2xl:pr-32 rtl:2xl:pl-32 ltr:3xl:pr-48 rtl:3xl:pl-48  border-b border-gray-300 py-8">
							<Counter
								quantity={quantity}
								onIncrement={() =>
									setQuantity((prev) => prev + 1)
								}
								onDecrement={() =>
									setQuantity((prev) =>
										prev !== 1 ? prev - 1 : 1
									)
								}
								disableDecrement={quantity === 1}
							/>
							<Button
								onClick={addToCart}
								variant="slim"
								className={`w-full md:w-6/12 xl:w-full ${
									!isSelected &&
									"bg-gray-400 hover:bg-gray-400"
								}`}
								disabled={!isOptionSelected}
								loading={addToCartLoader}
							>
								<span className="py-2 3xl:px-8">
									Add to cart
								</span>
							</Button>
						</div>
						{/* <div className="py-6">
              <ul className="text-sm space-y-5 pb-1">
                <li>
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    SKU:
                  </span>
                  {data?.sku}
                </li>
                <li>
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    Category:
                  </span>
                  <Link
                    href="/"
                    className="transition hover:underline hover:text-heading"
                  >
                    {data?.category?.name}
                  </Link>
                </li>
                {data?.tags && Array.isArray(data.tags) && (
                  <li className="productTags">
                    <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                      Tags:
                    </span>
                    {data.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={tag.slug}
                        className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                      >
                        {tag.name}
                        <span className="text-heading">,</span>
                      </Link>
                    ))}
                  </li>
                )}
              </ul>
            </div> */}

						{/* <ProductMetaReview data={data} /> */}
					</div>
				</div>
			</Container>
		</>
	);
}

ProductPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale!, [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
	};
};
