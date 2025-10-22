import { NextSeo } from "next-seo"
import Head from "next/head"
import { MetaData, AppConfig } from "@/utils/AppConfig"
import { useRouter } from "next/router"
interface IMetaProps {}

const Meta: React.FunctionComponent<IMetaProps> = ({}) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      {/* <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${router.basePath}/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${router.basePath}/favicon-32x32.png`}
          key="favicon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/favicon-16x16.png`}
          key="favicon16"
        />
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
      </Head> */}
      <NextSeo
        title={MetaData.title}
        description={MetaData.description}
        openGraph={{
          title: MetaData.title,
          description: MetaData.description,
          site_name: AppConfig.siteName,
        }}
      />
    </>
  )
}

export default Meta
