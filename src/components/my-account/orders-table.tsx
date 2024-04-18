import { motion } from 'framer-motion';
import { fadeInTop } from '@utils/motion/fade-in-top';
import Link from '@components/ui/link';
import { useWindowSize } from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useSsrCompatible } from '@utils/use-ssr-compatible';

const OrdersTable: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const { width } = useSsrCompatible(useWindowSize(), { width: 0, height: 0 });
  const { t } = useTranslation('common');

  return (
    <>
      <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-heading xl:mb-8">
        {t('text-orders')}
      </h2>
      <motion.div
        layout
        initial="from"
        animate="to"
        exit="from"
        //@ts-ignore
        variants={fadeInTop(0.35)}
        className={`w-full flex flex-col`}
      >
        {width >= 1025 ? (
          <table>
            <thead className="text-sm lg:text-base">
              <tr>
                <th className="p-4 font-semibold bg-gray-100 text-heading ltr:text-left rtl:text-right ltr:first:rounded-tl-md rtl:first:rounded-tr-md">
                  {t('text-order')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading ltr:text-left rtl:text-right lg:text-center">
                  {t('text-date')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading ltr:text-left rtl:text-right lg:text-center">
                  {t('text-status')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading ltr:text-left rtl:text-right lg:text-center">
                  {t('text-total')}
                </th>
                <th className="p-4 font-semibold bg-gray-100 text-heading ltr:text-left rtl:text-right ltr:lg:text-right rtl:lg:text-left ltr:last:rounded-tr-md rtl:last:rounded-tl-md">
                  {t('text-actions')}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm lg:text-base">
              {orders.map(order => (
                <tr className="border-b border-gray-300 last:border-b-0" key={order._id}>
                  <td className="px-4 py-5 ltr:text-left rtl:text-right">
                    <Link
                      href={`/my-account/orders/${order._id}`}
                      className="underline hover:no-underline text-body"
                    >
                      #{order._id}
                    </Link>
                  </td>
                  <td className="px-4 py-5 ltr:text-left rtl:text-right lg:text-center text-heading">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-5 ltr:text-left rtl:text-right lg:text-center text-heading">
                    {order.status}
                  </td>
                  <td className="px-4 py-5 ltr:text-left rtl:text-right lg:text-center text-heading">
                    ${order.totalPrice.toFixed(2)} for {order.products.length} items
                  </td>
                  <td className="px-4 py-5 ltr:text-right rtl:text-left text-heading">
                    <Link
                      href={`/my-account/orders/${order._id}`}
                      className="text-sm leading-4 bg-heading text-white px-4 py-2.5 inline-block rounded-md hover:text-white hover:bg-gray-600"
                    >
                      {t('button-view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="w-full space-y-4">
            {orders.map(order => (
              <ul className="flex flex-col px-4 pt-5 pb-6 space-y-5 text-sm font-semibold border border-gray-300 rounded-md text-heading" key={order._id}>
                <li className="flex items-center justify-between">
                  {t('text-order')}
                  <span className="font-normal">
                    <Link
                      href={`/my-account/orders/${order._id}`}
                      className="underline hover:no-underline text-body"
                    >
                      #{order._id}
                    </Link>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-date')}
                  <span className="font-normal">{new Date(order.createdAt).toLocaleDateString()}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-status')}
                  <span className="font-normal">{order.status}</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-total')}
                  <span className="font-normal">${order.totalPrice.toFixed(2)} for {order.products.length} items</span>
                </li>
                <li className="flex items-center justify-between">
                  {t('text-actions')}
                  <span className="font-normal">
                    <Link
                      href={`/my-account/orders/${order._id}`}
                      className="text-sm leading-4 bg-heading text-white px-4 py-2.5 inline-block rounded-md hover:text-white hover:bg-gray-600"
                    >
                      {t('button-view')}
                    </Link>
                  </span>
                </li>
              </ul>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default OrdersTable;
