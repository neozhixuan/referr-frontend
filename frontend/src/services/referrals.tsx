import http from "../http-common";
import { inputValueType } from "../components/YourOwnPage/CustomPage";
export class ReferralDataService {
  // Referral Services
  getAll(page = 0) {
    return http.get(`referrals?page=${page}`);
  }
  find(query: string, by = "organisation", page = 0) {
    return http.get(`referrals?${by}=${query}&page=${page}`);
  }
  findExact(query: string, by = "exact", page = 0) {
    return http.get(`referrals?${by}=${query}&page=${page}`);
  }
  updateReferral(data: inputValueType) {
    return http.put("/referrals", data);
  }
  createReferral(data: inputValueType) {
    return http.post(
      "/referrals",
      { ...data, date: new Date() },
      { withCredentials: true }
    );
  }
  deleteReferral(data: { userId: string; _id: string }) {
    return http.delete("/referrals", { data });
  }
  like(data: { userId: string; id: string; like: boolean }) {
    return http.put("/like", data, { withCredentials: true });
  }

  // Authentication Services
  auth() {
    return http.post("/", {}, { withCredentials: true });
  }
  login(data: { email: string; password: string }) {
    return http.post("/login", data, { withCredentials: true });
  }

  register(data: { email: string; password: string; username?: string }) {
    return http.post("/signup", data, { withCredentials: true });
  }
}

export class OrganisationDataService {
  getAll(page = 0) {
    return http.get(`organisations?page=${page}`);
  }
  createOrg(data: { orgName: string; imgUrl: string; userId?: string }) {
    return http.post("/organisations", { ...data, date: new Date() });
  }
}
