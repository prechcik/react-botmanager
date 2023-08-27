import axios from "axios";
var url = window.location.hostname;

const instance = axios.create({
	baseURL: "http://" + url + ":8800",
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common["Authorization"] = "AUTH TOKEN FROM INSTANCE";
export default instance;
