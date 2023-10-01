import {attractionApi, dealsApi, telecomApi} from "./api";
import { handleApiErrors } from "../helper/errorCatching";
export async function getAllDealList() {
  try {
    const response = await dealsApi.get(`/getAllDealList`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("dealRedux getAllTelecomList Error : ", error);
    return {status: false, data: error.message};
  }
}

export async function getDealById(dealId) {
  try {
    const response = await dealsApi.get(`/getDealById/${dealId}`);
    return handleApiErrors(response);
  } catch (error) {
    console.error("dealRedux getDealById Error : ", error);
    return {status: false, data: error.message};
  }
}
