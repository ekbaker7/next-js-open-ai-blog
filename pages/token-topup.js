import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import Router from 'next/router';

export default function TokenTopup(props) {
  const handleClick = async () => {
    const result = await fetch('/api/addTokens', {
      method: "POST"
    })

    const json = await result.json()
    window.location.href = json.session.url
  }

  return (
    <div>
      <h1>This is the token topup page</h1>
      <button className="btn" onClick={handleClick}>Add Tokens</button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    return {
      props
    }
  }
});
