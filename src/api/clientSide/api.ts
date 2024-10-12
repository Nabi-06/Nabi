import authAPI from "./auth.api";
import profilesAPI from "./profiles.api";
import recruitsAPI from "./recruits.api";
import regularSponsorShipAPI from "./regularSponsorShip.api";
import storeDataAPI from "./storeData.api";
import storeOwnersAPI from "./storeOwners.api";

const clientApi = {
  auth: authAPI,
  profiles: profilesAPI,
  storeData: storeDataAPI,
  recruits: recruitsAPI,
  storeOwners: storeOwnersAPI,
  payment: regularSponsorShipAPI,
};

export default clientApi;
