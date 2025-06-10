export const getColor = (color: string): string => {
  const root = document.querySelector(":root");
  if (root) {
    const rs = getComputedStyle(root);
    return rs.getPropertyValue(color);
  } else return "";
};
