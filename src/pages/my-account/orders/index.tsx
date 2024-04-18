'use client'
import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrdersTable from "@components/my-account/orders-table";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import Cookies from "js-cookie";

export default function OrdersTablePage({ orders }) {
	return (
		<AccountLayout>
			<OrdersTable orders={orders} />
		</AccountLayout>
	);
}

OrdersTablePage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
	var userData;
	const authToken = req.cookies.token;
	if (authToken) {
		try {
			userData = JSON.parse(authToken);
			console.log("userData", userData);
		} catch (error) {
			console.error("Error parsing JSON:", error);
			console.log("authToken content:", authToken);
		}
	}
	try {
		const {
			data: { orders },
		} = await http.get(API_ENDPOINTS.GET_USER_ORDERS(userData?._id));
		console.log("orders")
		console.log(orders)
		console.log("orders")

		return {
			props: {
				orders,
				...(await serverSideTranslations(locale!, [
					"common",
					"forms",
					"menu",
					"footer",
				])),
			},
		};
	} catch (error) {
		console.error("Error fetching orders:", error);
		return {
			props: {
				orders: [],
				...(await serverSideTranslations(locale!, [
					"common",
					"forms",
					"menu",
					"footer",
				])),
			},
		};
	}
};
