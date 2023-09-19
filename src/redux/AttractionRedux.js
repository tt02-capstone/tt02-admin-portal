import axios from "axios";

const attractionURL = "http://localhost:8080/attraction";

export async function getAttractionList() {
    try {
        const response = await axios.get(`${attractionURL}/getAllAttraction`);
        if (response.data != []) {
            // console.log('success', response.data);
            return response.data;
        }    
    } catch (error) {
        console.error("Retrieve attraction list error!");
    }
}