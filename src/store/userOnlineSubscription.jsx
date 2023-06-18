import { gql } from "@apollo/client";

const USER_ONLINE_SUBSCRIPTION = gql`
    subscription {
        userOnline {
        isOnline
        pin
        }
    }
`

export default USER_ONLINE_SUBSCRIPTION