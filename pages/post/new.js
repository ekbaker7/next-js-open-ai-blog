import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import Router, { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function NewPost(props) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generatePost", {
        method: "POST",
        body: JSON.stringify({ topic, keywords }),
        headers: {
          "content-type": "application/json",
        },
      });

      const json = await response.json();
      router.push(`/post/${json.postId}`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {loading && (
        <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      )}
      {!loading && (
        <div className="h-full w-full flex flex-col overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200"
          >
            <div className="">
              <label>
                <strong>Generate a blog post on the topic of:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={80}
              />
            </div>
            <div className="">
              <label>
                <strong>Target the following keywords:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                maxLength={80}
              />
              <small className="block mb-2">
                Seperate keywords with a comma
              </small>
            </div>
            <button type="submit" className="btn" disabled={!keywords.trim() || !topic.trim()}>
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false
        }
      }
    }

    return {
      props,
    };
  },
});
