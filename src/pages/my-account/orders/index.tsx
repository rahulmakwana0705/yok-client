import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrdersTable from "@components/my-account/orders-table";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";

export default function OrdersTablePage({ orders }) {
	return (
		<AccountLayout>
			<OrdersTable orders={orders} />
		</AccountLayout>
	);
}

OrdersTablePage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	try {
		const { data: { orders } } = await http.get(API_ENDPOINTS.ORDERS);


		console.log(orders)
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
