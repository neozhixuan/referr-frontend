import { ReferralDataService } from "../services/referrals";

const referralDataService = new ReferralDataService();

export const checkAuth = async (): Promise<{ status: boolean; user: any }> => {
  try {
    const response = await referralDataService.auth();
    console.log("This is navbar checking auth");
    console.log(response.data);
    return Promise.resolve({ ...response.data });
  } catch (e) {
    return Promise.reject({ status: false, user: e });
  }
};
