import { ReferralDataService } from "../services/referrals";
const referralDataService = new ReferralDataService();

export type handleLikeType = {
  id: string;
  incl: boolean;
  user: string;
  retrieveReferrals: () => void;
  setLoad: (callback: (prevArray: string[]) => string[]) => void;
  setLocalLikes: (callback: (prevArray: string[]) => string[]) => void;
  localLikes: Array<string>;
};

export const handleLike = async ({
  id,
  incl,
  user,
  retrieveReferrals,
  setLoad,
  setLocalLikes,
  localLikes,
}: handleLikeType) => {
  let like = true;
  setLoad((prevArray: Array<string>) => [...prevArray, id]);
  setTimeout(
    () => setLoad((prevArray) => prevArray.filter((entry) => entry !== id)),
    2000
  );
  (localLikes.includes(id) || incl) && (like = false);

  referralDataService
    .like({ userId: user, id: id, like: like })
    .then((response) => {
      const { status } = response.data;
      like
        ? setLocalLikes((prevArray) => [...prevArray, id])
        : setLocalLikes((prevArray) =>
            prevArray.filter((entry) => entry !== id)
          );
      if (status === "success") {
        retrieveReferrals();
      }
    })
    .catch((e) => {
      console.log(e);
    });
};
