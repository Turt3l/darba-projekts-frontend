import { gql } from "@apollo/client";

const NEW_USER_SUBSCRIPTION = gql`
    subscription {
        userAdded {
            username
            role
            pin
            isAlerted
            isOnline
        }
    }
`

export default NEW_USER_SUBSCRIPTION