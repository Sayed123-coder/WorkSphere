import {Router} from "express";
import { activeCheck, commentPost, createPost, delete_comment_of_user, deletePost, get_all_comments, getAllPosts, getUserPosts, increment_likes } from "../controllers/post.controller.js";
import upload from "../middleware/multer.js";
import {isAuthenticated} from "../middleware/auth.js";

const router=Router()


router.route("/").get(activeCheck);
router.route("/post").post(isAuthenticated,upload.single("media"),createPost);
router.route("/posts").get(getAllPosts);
router.route("/get_user_posts/:userId").get(getUserPosts)
router.route("/delete_post").delete(isAuthenticated,deletePost);
router.route("/add_comment").post(isAuthenticated,commentPost);
router.route("/get_comments").get(get_all_comments);
router.route("/delete_comment").delete(isAuthenticated,delete_comment_of_user);
router.route("/increment_like").post(isAuthenticated,increment_likes);
export default router;