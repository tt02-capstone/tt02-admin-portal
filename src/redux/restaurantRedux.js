import { restaurantApi } from "./api";
import { handleApiErrors } from "../helper/errorCatching";

const restURL = "http://localhost:8080/restaurant";

export async function getAllRestaurant() {
    try {
        const response = await restaurantApi.get(`${restURL}/getAllRestaurant`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("restaurantRedux getAllRestaurant Error : ", error);
        return { status: false, data: error.message };
    }
}

export async function getRestaurantDish(restId) { // get all the dish belonging to the restaurant 
    try {
        const response = await restaurantApi.get(`${restURL}/getRestaurantDish/${restId}`);
        return handleApiErrors(response);
    } catch (error) {
        console.error("restaurantRedux getRestaurantDish Error : ", error);
        return { status: false, data: error.message };
    }
}