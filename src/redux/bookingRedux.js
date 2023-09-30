import { bookingApi} from "./api";
import { handleApiErrors } from "../helper/errorCatching";

export async function getBookingById(id) {
    try {
      const response = await bookingApi.get(`/getBookingByBookingId/${id}`);
      return handleApiErrors(response);
    } catch (error) {
      console.error("bookingRedux getBookingById Error : ", error);
      return {status: false, data: error.message};
    }
  }

  export async function retrieveAllBookings() {
    try {
      const response = await bookingApi.get(`/retrieveAllBookings`);
      return handleApiErrors(response);
    } catch (error) {
      console.error("bookingRedux retrieveAllBookings Error : ", error);
      return {status: false, data: error.message};
    }
  }