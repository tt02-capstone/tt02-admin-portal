import axios from "axios";

const staffURL = "http://localhost:8080/staff";

export async function createAdmin(admin) {
    console.log(admin);
    await axios.post(`${staffURL}/createStaff`, admin)
    .then((response) => {
      if (response.data.httpStatusCode === 400) { // error
          console.log('fail')
        return false;
      } else { // success
        console.log("success in adminRedux");
        return true;
      }
    })
    .catch((error) => {
      console.error("AdminRedux createAdmin Error : ", error);
    });
}