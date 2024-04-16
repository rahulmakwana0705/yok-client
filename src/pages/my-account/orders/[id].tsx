import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrderDetails from "@components/order/order-details";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";

export default function OrderPage({ orderData }) {
	const router = useRouter();

	if (router.isFallback) {
		return <div>Loading...</div>; // Optional loading state while fetching data
	}

	return (
		<AccountLayout>
			<OrderDetails order={orderData} className="p-0" />
		</AccountLayout>
	);
}

OrderPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
	const { id } = params;

	const { data: { order } } = await http.get(API_ENDPOINTS.GET_ORDER(id));

	return {
		props: {
			order,
			...(await serverSideTranslations(locale!, [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
	};
};
