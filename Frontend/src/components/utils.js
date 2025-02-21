import axios from "axios";
const img_hosting_key = import.meta.env.VITE_IMBB_API;
const imghosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;
export const imgUpload = async (image) => {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await axios.post(imghosting_api, formData);
  const imageUrl = data.data.display_url;
  return imageUrl;
};
