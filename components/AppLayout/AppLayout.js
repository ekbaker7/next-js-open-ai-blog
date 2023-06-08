import { useUser } from "@auth0/nextjs-auth0/client";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../Logo";
import { useContext, useEffect } from "react";
import PostsContext from "../../context/postsContext";

function AppLayout({ children, availableTokens, posts: postsFromSSR, postId, postCreated }) {
  const { user } = useUser();

  const { setPostsFromSSR, posts, getMorePostsHandler, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find(post => post._id === postId)
      if (!exists) {
        getMorePostsHandler({ lastPostDate: postCreated, getNewerPosts: true })
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getMorePostsHandler]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link className="btn" href="/post/new">
            New Post
          </Link>
          <Link
            className="block mt-2 text-center hover:underline cursor-pointer"
            href="/token-topup"
          >
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">
              {availableTokens} Token{availableTokens === 1 ? "" : "s"}{" "}
              Available
            </span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts && (
            <>
              {posts.map((post) => (
                <Link
                  className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                    postId === post._id ? "bg-white/20 border-white" : ""
                  }`}
                  key={post._id}
                  href={`/post/${post._id}`}
                >
                  {post.topic}
                </Link>
              ))}
              {!noMorePosts && <div
                onClick={() => getMorePostsHandler({
                  lastPostDate: posts[posts.length - 1].createdAt
                })}
                className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
              >
                Load More Posts
              </div>}
            </>
          )}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default AppLayout;
