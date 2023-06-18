import { gql, useQuery } from "@apollo/client";

const GetUser = (pin) => {
    const GET_USER = gql`
    query {
        user(pin: ${pin}) {
            role
            username
            pin
            isAlerted
            isOnline
            joinedAlert
        }
    }
    `
    const { loading, data, error } = useQuery(GET_USER);
    const userLoading = loading;
    const userData = data?.user;
    const userError = error;
    return { userLoading, userData, userError };
}
export default GetUser