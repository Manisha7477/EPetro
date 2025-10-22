import Document, { Html, Head, Main, NextScript } from "next/document"
import { JSX } from "react"

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html className="min-h-full" lang="en" data-theme="light">
        <Head />
        <body className="min-h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default MyDocument
