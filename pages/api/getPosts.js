import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);

    const client = await clientPromise;
    const db = client.db("blogstandard");

    const userProfile = await db.collection("users").findOne({
      auth0Id: user.sub,
    });

    if (!userProfile) {
      res.status(403).json({ message: "No available tokens!" });
      return;
    }

    const { lastPostDate, getNewerPosts } = req.body;

    const posts = await db
      .collection("posts")
      .find({
        userId: userProfile._id,
        createdAt: { [getNewerPosts ? "$gt" : "$lt"]: new Date(lastPostDate) },
      })
      .limit(getNewerPosts ? 0 : 5)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ posts });
    return;
  } catch (error) {
    res.status(403).json({ message: error });
    return;
  }
});
