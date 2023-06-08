import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

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

    const { postId } = req.body;

    await db
      .collection("posts")
      .deleteOne({
        userId: userProfile._id,
        _id: ObjectId(postId)
      })

    res.status(200).json({ success: true });
    return;
  } catch (error) {
    res.status(403).json({ success: false, message: error });
    return;
  }
});
