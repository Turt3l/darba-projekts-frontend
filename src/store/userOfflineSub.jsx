import { gql } from "@apollo/client";

const USER_OFFLINE_SUBSCRIPTION = gql`
    subscription {
        userOnline {
            isOnline
            username
            pin
        }
    }
`

export default USER_OFFLINE_SUBSCRIPTION