import { organisationType } from "../../types";
export const mapOptions = (
  org: organisationType[] | never[]
): { value: string; label: string }[] => {
  return org.map((o) => ({
    value: o.name,
    label: o.name,
  }));
};

export const customStyles = {
  option: (provided: any) => ({
    ...provided,
    color: "black", // Set a custom width
  }),
};
