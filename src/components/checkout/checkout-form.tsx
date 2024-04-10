import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import TextArea from "@components/ui/text-area";
import { useCheckoutMutation } from "@framework/checkout/use-checkout";
import { CheckBox } from "@components/ui/checkbox";
import Button from "@components/ui/button";
import Router from "next/router";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useEffect, useState } from "react";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import Cookies from "js-cookie";

interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
  paymentMethod: string;
  response: object;
}

var userData;
const authToken = Cookies.get("token");
if (authToken) {
  userData = JSON.parse(authToken);
}

const CheckoutForm: React.FC = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string>("online");
  const { mutate: updateUser, isPending } = useCheckoutMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInputType>();
  console.log("selectedOption", selectedOption);

  const { items, total, isEmpty } = useCart();
  const { price: subtotal } = usePrice({
    amount: total,
    currencyCode: "USD",
  });

  // console.log("items at checkout items", items);
  // console.log("items at checkout total", total);
  // console.log("items at checkout subtotal", subtotal);
  // console.log("items at checkout isEmpty", isEmpty);

  async function onSubmit(input: CheckoutInputType) {
    const allProduct = items.map((product) => ({
      product: product._id,
      quantity: product?.quantity || 0,
    }));
    const inputData: CheckoutInputType = { ...input, paymentMethod: selectedOption };
    if (selectedOption === "online") {
    } else if (selectedOption === "cod") {
    }
    console.log(updateUser);
    console.log("Test payment button clicked!");
    const { data: razorpayKeys } = await http.get(
      API_ENDPOINTS.GET_RAZORPAYKEYS
    );
    const { data } = await http.post(API_ENDPOINTS.CREATE_ORDER, inputData);
    console.log(data);
    if (selectedOption === "online") {
      if (data.success) {
        var options = {
          key: razorpayKeys.keys.key,
          amount: "50000",
          currency: "INR",
          name: "YOK",
          description: "Test Transaction",
          image:
            "http://localhost:3000/_next/image?url=%2Fassets%2Fimages%2Flogo.png&w=96&q=75",
          order_id: data.order.id,
          handler: function (response: any) {
            console.log(response);
            updateUser({ ...input, response });
          },
          prefill: {
            name: "John doe",
            email: "johndoe@gmail.com",
            contact: "9999999999",
          },
          notes: {
            test: "This is test function",
          },
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on("payment.failed", function (response: any) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      }
    }
    if (!isEmpty) {
      console.log("updateUser", updateUser);
      console.log("Test payment button clicked!");
      const { data: razorpayKeys } = await http.get(
        API_ENDPOINTS.GET_RAZORPAYKEYS
      );
      const { data } = await http.post(API_ENDPOINTS.CREATE_ORDER, {
        user: userData?._id,
        products: allProduct,
        totalPrice: total,
        tracking_number: 0,
        shippingAddress: input,
        status: "pending",
        paymentMethod: selectedOption,
        paymentStatus: "pending",
        transactionId: "",
      });
      console.log(data);
      if (data.success) {
        var options = {
          key: razorpayKeys.keys.key,
          amount: "50000",
          currency: "INR",
          name: "YOK",
          description: "Test Transaction",
          image:
            "http://localhost:3000/_next/image?url=%2Fassets%2Fimages%2Flogo.png&w=96&q=75",
          order_id: data.order.id,
          handler: function (response: any) {
            console.log(response);
            updateUser({ ...input, response });
          },
          prefill: {
            name: "John doe",
            email: "johndoe@gmail.com",
            contact: "9999999999",
          },
          notes: {
            test: "This is test function",
          },
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on("payment.failed", function (response: any) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      }
      updateUser(input);
    }

    // Router.push(ROUTES.ORDER);
  }
  function onPaymentSuccess(response: CheckoutInputType) {
    console.log(response);
    updateUser({ ...data, response });
    // Router.push(ROUTES.ORDER);
  }
  // New Function to Handle Test Payment
  const handleTestPayment = async (e: any) => {
    e.preventDefault();
    console.log(updateUser);
  };

  useEffect(() => {
    const storedOption = localStorage.getItem("selectedPaymentOption");
    if (storedOption) {
      setSelectedOption(storedOption);
    }
  }, []);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOption(value);
    localStorage.setItem("selectedPaymentOption", value);
  };

  return (
    <>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {t("text-shipping-address")}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center "
        noValidate
      >
        <div className="flex flex-col space-y-4 lg:space-y-5">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-first-name"
              {...register("firstName", {
                required: "forms:first-name-required",
              })}
              errorKey={errors.firstName?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />
            <Input
              labelKey="forms:label-last-name"
              {...register("lastName", {
                required: "forms:last-name-required",
              })}
              errorKey={errors.lastName?.message}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <Input
            labelKey="forms:label-address"
            {...register("address", {
              required: "forms:address-required",
            })}
            errorKey={errors.address?.message}
            variant="solid"
          />
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              type="tel"
              labelKey="forms:label-phone"
              {...register("phone", {
                required: "forms:phone-required",
              })}
              errorKey={errors.phone?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />

            <Input
              type="email"
              labelKey="forms:label-email-star"
              {...register("email", {
                required: "forms:email-required",
                pattern: {
                  value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "forms:email-error",
                },
              })}
              errorKey={errors.email?.message}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              labelKey="forms:label-city"
              {...register("city")}
              variant="solid"
              className="w-full lg:w-1/2 "
            />

            <Input
              labelKey="Postcode *"
              {...register("zipCode")}
              variant="solid"
              className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
            />
          </div>
          <div className="items-center">
            <p>Select Payment Option</p>
            <div>
              <input
                id="online-payment"
                type="radio"
                name="payment-option"
                value="online"
                checked={selectedOption === "online"}
                onChange={handleOptionChange}
              />
              <label htmlFor="online-payment" style={{ marginLeft: "10px" }}>
                Online
              </label>
            </div>
            <div>
              <input
                id="cod-payment"
                type="radio"
                name="payment-option"
                value="cod"
                checked={selectedOption === "cod"}
                onChange={handleOptionChange}
              />
              <label htmlFor="cod-payment" style={{ marginLeft: "10px" }}>
                Cash on Delivery
              </label>
            </div>
          </div>
          <TextArea
            labelKey="forms:label-order-notes"
            {...register("note")}
            placeholderKey="forms:placeholder-order-notes"
            className="relative pt-3 xl:pt-6"
          />
          <div className="flex w-full">
            <Button
              className="w-full sm:w-auto"
              loading={isPending}
              disabled={isPending}
            >
              {t("common:button-place-order")}
            </Button>

            <Button
              onClick={(e) => {
                handleTestPayment(e);
              }}
            >
              Test
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
