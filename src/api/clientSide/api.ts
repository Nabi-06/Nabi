import authAPI from "./auth.api";
import profilesAPI from "./profiles.api";
import recruitsAPI from "./recruits.api";
import repliesAPI from "./replies";
import sponsorAPI from "./sponsor.api";

const clientApi = {
  auth: authAPI,
  profiles: profilesAPI,
  recruits: recruitsAPI,
  sponsor: sponsorAPI,
  replies: repliesAPI,
};

export default clientApi;
