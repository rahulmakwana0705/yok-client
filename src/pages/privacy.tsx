/* eslint-disable */
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import PageHeader from "@components/ui/page-header";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import axios from "axios";

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(" ").join("_");
}

export default function PrivacyPage({ privacyPolicyContent }) {
  const { t } = useTranslation("privacy");

  console.log(privacyPolicyContent);
  return (
    <>
      <PageHeader pageHeader="text-page-privacy-policy" />
      <div className="px-4 mt-12 border-b border-gray-300 lg:mt-14 xl:mt-16 lg:py-1 xl:py-0 md:px-10 lg:px-7 xl:px-16 2xl:px-24 3xl:px-32 pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24">
        <Container>
          <div className="flex flex-col md:flex-row">
            <div className="pt-0 md:w-full lg:pt-2">
              <div className="mb-10">
                <div className="mb-4 text-lg font-bold md:text-xl lg:text-2xl text-heading">
                  {t("Privacy Policy")}
                </div>
                <div
                  className="text-sm leading-7 text-heading lg:text-base lg:leading-loose"
                  dangerouslySetInnerHTML={{
                    __html: privacyPolicyContent,
                  }}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

PrivacyPage.Layout = Layout;

export async function getServerSideProps({ locale }) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/policy/get`);
    const privacyPolicyContent = response.data.privacyPolicy.content || "";

    return {
      props: {
        ...(await serverSideTranslations(locale!, [
          "common",
          "forms",
          "menu",
          "privacy",
          "footer",
        ])),
        privacyPolicyContent,
      },
    };
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale!, [
          "common",
          "forms",
          "menu",
          "privacy",
          "footer",
        ])),
        privacyPolicyContent: "",
      },
    };
  }
}
