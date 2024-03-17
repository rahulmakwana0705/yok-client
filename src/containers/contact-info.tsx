import { FC, useEffect, useState } from 'react';
import { IoLocationSharp, IoMail, IoCallSharp } from 'react-icons/io5';
import Link from '@components/ui/link';
import { useTranslation } from 'next-i18next';
const mapImage = '/assets/images/map-image.jpg';

interface Props {
  image?: HTMLImageElement;
}
const ContactInfoBlock: FC<Props> = () => {
  const { t } = useTranslation('common');
  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    updateContactData();
  }, []);

  const data = [
    {
      id: 1,
      slug: '/',
      icon: <IoLocationSharp />,
      name: 'text-address',
      description: contactData[0]?.address,
    },
    {
      id: 2,
      slug: '/',
      icon: <IoMail />,
      name: 'text-email',
      description: contactData[0]?.email,
    },
    {
      id: 3,
      slug: '/',
      icon: <IoCallSharp />,
      name: 'text-phone',
      description: contactData[0]?.phone,
    },
  ];
  console.log(contactData);
  const updateContactData = async () => {
    try {
      const response = await fetch('/api/find-us-here/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        
        setContactData(responseData.data);
      } else {
        console.error('Error updating contact data:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating contact data:', error);
    }
  };


  return (
    <div className="mb-6 lg:border lg:rounded-md border-gray-300 lg:p-7">
      <h4 className="text-2xl md:text-lg font-bold text-heading pb-7 md:pb-10 lg:pb-6 -mt-1">
        {t('text-find-us-here')}
      </h4>
      {data?.map((item: any) => (
        <div key={`contact--key${item.id}`} className="flex pb-7">
          <div className="flex flex-shrink-0 justify-center items-center p-1.5 border rounded-md border-gray-300 w-10 h-10">
            {item.icon}
          </div>
          <div className="flex flex-col ltr:pl-3 rtl:pr-3 ltr:2xl:pl-4 rtl:2xl:pr-4">
            <h5 className="text-sm font-bold text-heading">
              {t(`${item.name}`)}
            </h5>
            <Link href={item.slug} className="text-sm mt-0">
              {item.description}
            </Link>
          </div>
        </div>
      ))}
      <img src={mapImage} alt={t('text-map')} className="rounded-md" />
    </div>
  );
};

export default ContactInfoBlock;
