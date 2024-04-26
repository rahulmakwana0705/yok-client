import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import TextArea from "@components/ui/text-area";
import { CheckBox } from "@components/ui/checkbox";
import { useState } from "react";
import PageHeader from "@components/ui/page-header";

interface ContactFormValues {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export default function ContactUsPage() {
	const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ContactFormValues>();
	function onSubmit(values: ContactFormValues) {
		console.log(values, "contact");
		values.selectedCheckboxes = selectedCheckboxes;
		fetch("api/b2b/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to add b2b");
				}
			})
			.catch((error) => {
				console.error("Error adding item to cart:", error);
			});
	}
	//   const { t } = useTranslation();

	const { t } = useTranslation("common");
	console.log("selectedCheckboxes", selectedCheckboxes);

	const handleCheckboxChange = (label: string) => {
		if (selectedCheckboxes.includes(label)) {
			setSelectedCheckboxes((prevState) =>
				prevState.filter((item) => item !== label)
			);
		} else {
			setSelectedCheckboxes((prevState) => [...prevState, label]);
		}
	};

	return (
		<>
			<PageHeader pageHeader="b2b" />
			<Container>
				<div className="my-14 justify-center lg:my-16 xl:my-20 px-0 pb-2 lg: xl:max-w-screen-xl mx-auto flex flex-col md:flex-row w-full">
					{/* <div className="md:w-full lg:w-2/5 2xl:w-2/6 flex flex-col h-full">
            <ContactInfoBlock />
          </div> */}
					<div className="md:w-full lg:w-3/5 2xl:w-4/6 flex h-full rtl:md:mr-7 flex-col rtl:lg:pr-7">
						<div className="flex pb-7 md:pb-9 mt-7 md:-mt-1.5">
							<h4 className="text-2xl 2xl:text-3xl font-bold text-heading">
								{t("text-get-in-touch")}
							</h4>
						</div>
						{/* <ContactForm /> */}
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="w-full mx-auto flex flex-col justify-center "
							noValidate
						>
							<div className="flex flex-col space-y-5">
								<div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
									<Input
										labelKey="forms:label-name-required"
										placeholderKey="forms:placeholder-name"
										{...register("name", {
											required: "forms:name-required",
										})}
										className="w-full md:w-1/2 "
										errorKey={errors.name?.message}
										variant="solid"
									/>
									<Input
										labelKey="forms:label-email-required"
										type="email"
										placeholderKey="forms:placeholder-email"
										{...register("email", {
											required: "forms:email-required",
											pattern: {
												value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
												message: "forms:email-error",
											},
										})}
										className="w-full md:w-1/2 ltr:md:ml-2.5 rtl:md:mr-2.5 ltr:lg:ml-5 rtl:lg:mr-5 mt-2 md:mt-0"
										errorKey={errors.email?.message}
										variant="solid"
									/>
								</div>
								<div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
									<Input
										type="tel"
										labelKey="forms:label-mobile"
										{...register("phone", {
											required: "forms:phone-required",
										})}
										errorKey={errors.phone?.message}
										variant="solid"
										className="w-full md:w-1/2 "
									/>

									<Input
										labelKey="forms:label-city"
										{...register("city")}
										variant="solid"
										className="w-full md:w-1/2 ltr:md:ml-2.5 rtl:md:mr-2.5 ltr:lg:ml-5 rtl:lg:mr-5 mt-2 md:mt-0"
									/>
								</div>
								<div className="relative flex flex-wrap items-center ">
									<CheckBox
										labelKey="Basics"
										onChange={() =>
											handleCheckboxChange("Basics")
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Stretch T-shirts"
										onChange={() =>
											handleCheckboxChange(
												"Stretch T-shirts"
											)
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Smart Tech Polo"
										onChange={() =>
											handleCheckboxChange(
												"Smart Tech Polo"
											)
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Edition Polo"
										onChange={() =>
											handleCheckboxChange("Edition Polo")
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Oversized"
										onChange={() =>
											handleCheckboxChange("Oversized")
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Boxers"
										onChange={() =>
											handleCheckboxChange("Boxers")
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Graphic T-shirts"
										onChange={() =>
											handleCheckboxChange(
												"Graphic T-shirts"
											)
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Sleeveless TankTop"
										onChange={() =>
											handleCheckboxChange(
												"Sleeveless TankTop"
											)
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Printed T-shirts"
										onChange={() =>
											handleCheckboxChange(
												"Printed T-shirts"
											)
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Full Sleeves Solids"
										onChange={() =>
											handleCheckboxChange(
												"Full Sleeves Solids"
											)
										}
									/>
								</div>
								<div className="relative flex items-center ">
									<CheckBox
										labelKey="Shorts"
										onChange={() =>
											handleCheckboxChange("Shorts")
										}
									/>
								</div>
								<div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
									<Input
										labelKey="Number of Shops"
										{...register("numberOfShops")}
										variant="solid"
										className="w-full lg:w-1/2 "
									/>
									<Input
										labelKey="Quantity"
										{...register("quantity")}
										variant="solid"
										className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
									/>
								</div>
								<TextArea
									labelKey="forms:label-message"
									{...register("message")}
									className="relative mb-4"
									placeholderKey="forms:placeholder-message"
								/>
								<div className="relative">
									<Button
										type="submit"
										className="h-12 lg:h-14 mt-1 text-sm lg:text-base w-full sm:w-auto"
									>
										{t("common:button-send-message")}
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<Subscription />
			</Container>
		</>
	);
}

ContactUsPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
