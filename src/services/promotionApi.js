import axios from "axios";

export const fetchPromotionSections = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/promotions/sections`
  );

  let sections = res.data?.data || [];

  sections.sort((a, b) => {
    if (a.name?.toLowerCase() === "features") return -1;
    if (b.name?.toLowerCase() === "features") return 1;
    return 0;
  });

  return sections;
};