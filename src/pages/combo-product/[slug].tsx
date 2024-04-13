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

import cn from "classnames";
import axios from "axios";
import Cookies from "js-cookie";
import { useUI } from "@contexts/ui.context";

const productGalleryCarouselResponsive = {
  "768": {
    slidesPerView: 2,
  },
  "0": {
    slidesPerView: 1,
  },
};

const data = {
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
      thumbnail: "/assets/images/products/p-20-1.png",
      original: "/assets/images/products/p-20-1.png",
    },
    //   {
    // 	"id": 2,
    // 	"thumbnail": "/assets/images/products/p-20-2.png",
    // 	"original": "/assets/images/products/p-20-2.png"
    //   },
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

  const { openSearch, openModal, setModalView, isAuthorized } = useUI();

  const { width } = useSsrCompatible(useWindowSize(), { width: 0, height: 0 });
  const { isLoading } = useProductQuery(slug as string);
  const { addItemToCart } = useCart();
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [data, setData] = useState(null);
  const { price, basePrice, discount } = usePrice(
    data && {
      amount: data.sale_price ? data.sale_price : data.price,
      baseAmount: data.price,
      currencyCode: "USD",
    }
  );

  useEffect(() => {
    if (!slug) {
      return; // Exit early if slug is not defined
    }
    const loadCartData = async () => {
      try {
        const response = await axios.post(`/api/product/get-single`, {
          slug,
        });
        console.log("response product hahj", response);
        setData(response?.data);
      } catch (error) {
        console.log("error on get cart", error);
      }
    };
    loadCartData();
  }, [slug]);

  if (isLoading) return <p>Loading...</p>;
  const variations = getVariations(data?.variations);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;

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

    fetch("http://localhost:3000/api/add-to-cart/create", {
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
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });

    console.log(item, "item");
  }

  function handleAttribute(attribute: any) {
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }
  console.log("slug", slug);

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
          {width < 1025 ? (
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
                      {variations[variation]?.map(({ id, value, meta }) => (
                        <li
                          key={`${value}-${id}`}
                          className={cn(
                            "cursor-pointer rounded border  w-9 md:w-11 h-9 md:h-11 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 ltr:md:mr-3 rtl:md:ml-3 flex justify-center items-center text-heading text-xs md:text-sm uppercase font-semibold transition duration-200 ease-in-out hover:border-black",
                            value === attributes[variation]
                              ? "border-black"
                              : "border-gray-100"
                          )}
                          onClick={() =>
                            handleAttribute({ [variation]: value })
                          }
                        >
                          {variation === "color" ? (
                            <span
                              className="block w-full h-full rounded"
                              style={{ backgroundColor: meta }}
                            />
                          ) : (
                            value
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="pb-3 border-b border-gray-300 flex">
              {Object.keys(variations).map((variation) => {
                return (
                  <div key={variation} className="mr-10">
                    <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
                      {variation}
                    </h3>
                    <ul className="flex flex-wrap colors ltr:-mr-3 rtl:-ml-3">
                      {variations[variation]?.map(({ id, value, meta }) => (
                        <li
                          key={`${value}-${id}`}
                          className={cn(
                            "cursor-pointer rounded border  w-9 md:w-11 h-9 md:h-11 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 ltr:md:mr-3 rtl:md:ml-3 flex justify-center items-center text-heading text-xs md:text-sm uppercase font-semibold transition duration-200 ease-in-out hover:border-black",
                            value === attributes[variation]
                              ? "border-black"
                              : "border-gray-100"
                          )}
                          onClick={() =>
                            handleAttribute({ [variation]: value })
                          }
                        >
                          {variation === "color" ? (
                            <span
                              className="block w-full h-full rounded"
                              style={{ backgroundColor: meta }}
                            />
                          ) : (
                            value
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="pb-3 border-b border-gray-300 flex">
              {Object.keys(variations).map((variation) => {
                return (
                  <div key={variation} className="mr-10">
                    <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
                      {variation}
                    </h3>
                    <ul className="flex flex-wrap colors ltr:-mr-3 rtl:-ml-3">
                      {variations[variation]?.map(({ id, value, meta }) => (
                        <li
                          key={`${value}-${id}`}
                          className={cn(
                            "cursor-pointer rounded border  w-9 md:w-11 h-9 md:h-11 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 ltr:md:mr-3 rtl:md:ml-3 flex justify-center items-center text-heading text-xs md:text-sm uppercase font-semibold transition duration-200 ease-in-out hover:border-black",
                            value === attributes[variation]
                              ? "border-black"
                              : "border-gray-100"
                          )}
                          onClick={() =>
                            handleAttribute({ [variation]: value })
                          }
                        >
                          {variation === "color" ? (
                            <span
                              className="block w-full h-full rounded"
                              style={{ backgroundColor: meta }}
                            />
                          ) : (
                            value
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            {/* <div className="pb-3 mt-4 border-b border-gray-300 flex">
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
            </div> */}
            <div className="flex items-center gap-x-4 ltr:md:pr-32 rtl:md:pl-32 ltr:lg:pr-12 rtl:lg:pl-12 ltr:2xl:pr-32 rtl:2xl:pl-32 ltr:3xl:pr-48 rtl:3xl:pl-48  border-b border-gray-300 py-8">
              <Counter
                quantity={quantity}
                onIncrement={() => setQuantity((prev) => prev + 1)}
                onDecrement={() =>
                  setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                }
                disableDecrement={quantity === 1}
              />
              <Button
                onClick={addToCart}
                variant="slim"
                className={`w-full md:w-6/12 xl:w-full ${
                  !isSelected && "bg-gray-400 hover:bg-gray-400"
                }`}
                disabled={!isSelected}
                loading={addToCartLoader}
              >
                <span className="py-2 3xl:px-8">Add to cart</span>
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

            <ProductMetaReview data={data} />
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
