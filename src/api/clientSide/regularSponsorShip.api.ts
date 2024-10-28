import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { serverClient } from "../backEndClient";

const getBillingKey = async (requestData: {
  customerKey: string;
  authKey: string;
  price: number;
  recipientId: string;
}) => {
  const { data } = await serverClient.post("/issue-billing-key", requestData);

  return data;
};

const getMyRegularSponsorships = async (userId: string) => {
  const { data: myRegularSponsorships, error } = await supabase
    .from("regularSponsorship")
    .select()
    .eq("sponsorId", userId);

  if (error) throw new Error(error.message);

  return myRegularSponsorships;
};

const getSponsorshipBySponsorIdReturnRecipient = async (sponsorId: string) => {
  const query = `
  userProfiles!regularSponsorship_recipientId_fkey(*)
`;

  const { data: myRegularSponsorships } = await supabase
    .from("regularSponsorship")
    .select(query)
    .eq("sponsorId", sponsorId)
    .returns<
      {
        userProfiles: Tables<"userProfiles">;
      }[]
    >();

  const recipients: Tables<"userProfiles">[] = myRegularSponsorships?.map(
    (sponsorShips) => {
      return {
        ...sponsorShips.userProfiles,
      };
    }
  ) as Tables<"userProfiles">[];

  return recipients;
};

const getSponsorshipByRecipientIdReturnSponsor = async (
  recipientId: string
) => {
  const query = `
  userProfiles!regularSponsorship_sponsorId_fkey(*)
`;

  const { data: myRegularSponsorships } = await supabase
    .from("regularSponsorship")
    .select(query)
    .eq("recipientId", recipientId)
    .returns<
      {
        userProfiles: Tables<"userProfiles">;
      }[]
    >();

  const sponsors: Tables<"userProfiles">[] = myRegularSponsorships?.map(
    (sponsorShips) => {
      return {
        ...sponsorShips.userProfiles,
      };
    }
  ) as Tables<"userProfiles">[];

  return sponsors;
};

const addRegularSponsorship = async (data: {
  sponsorId: string;
  recipientId: string;
}) => {
  await supabase.from("regularSponsorship").insert(data);
};

const stopRegularSponsorship = async (userId: string, recipientId: string) => {
  await supabase
    .from("regularSponsorship")
    .delete()
    .eq("recipientId", recipientId)
    .eq("sponsorId", userId);
};

const regularSponsorShipAPI = {
  getBillingKey,
  getMyRegularSponsorships,
  addRegularSponsorship,
  stopRegularSponsorship,
  getSponsorshipBySponsorIdReturnRecipient,
  getSponsorshipByRecipientIdReturnSponsor,
};

export default regularSponsorShipAPI;
