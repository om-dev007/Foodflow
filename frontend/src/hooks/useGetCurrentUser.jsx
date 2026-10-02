import { useEffect } from "react"
import axios from "axios";
import { serverUrl } from "../App"

const useGetCurrentUser = () => {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
                console.log("Result: ", result)
            } catch (error) {
                console.error("Error while finding current user", error);
            }
        }
        fetchUser();
    }, [])
}

export default useGetCurrentUser