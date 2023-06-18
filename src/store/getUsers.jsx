import { gql, useQuery } from "@apollo/client";

const GetUsers = (role) => {
    const GET_USERS = gql`
    query {
        users(input: { role: "${role}" }) {
            users {
                username
                role
                isAlerted
                joinedAlert
                isOnline
                pin
            }
        }
    }
    `;

    const { loading, data, error } = useQuery(GET_USERS);
    const usersLoading = loading;
    const usersData = data?.users;
    const usersError = error;
    return { usersLoading, usersData, usersError };

}

export default GetUsers