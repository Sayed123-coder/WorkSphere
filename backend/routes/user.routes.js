import { Router } from 'express';
import { acceptConnectionRequest, downloadUserProfile, getAllUsersProfiles, getIncomingConnectionRequests, getMyConnectionRequest, getUserAndProfile, getUserProfileAndUserBasedOnUsername, login, register, removeConnection, sendConnectionRequest, updateCoverImage, updateProfileData, updateUserProfile, uploadProfilePicture } from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';
const router=Router();
import {isAuthenticated} from "../middleware/auth.js"


router.route("/update_profile_picture")
.post(upload.single("profile_picture"),isAuthenticated,uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);

router.route("/user_update").post(isAuthenticated,updateUserProfile);
router.route("/get_user_and_profile").get(isAuthenticated,getUserAndProfile);
router.route("/update_profile_data").post(isAuthenticated,updateProfileData);
router.route("/update_cover_image").post(isAuthenticated,upload.single("coverImage"),updateCoverImage)
router.route("/user/get_all_users").get(getAllUsersProfiles);
router.route("/user/download_resume").get(downloadUserProfile);
router.route("/user/send_connection_request").post(isAuthenticated,sendConnectionRequest);
router.route("/user/getConnectionRequests").get(isAuthenticated,getMyConnectionRequest);
router.route("/user/user_connection_request").get(isAuthenticated,getIncomingConnectionRequests);
router.route("/user/accept_connection_request").post(isAuthenticated,acceptConnectionRequest);
router.route("/user/remove_connection/:targetUserId").delete(isAuthenticated,removeConnection);
router.route("/user/get_profile_based_on_username").get(isAuthenticated,getUserProfileAndUserBasedOnUsername);
export default router;
