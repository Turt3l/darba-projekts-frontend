import { gql } from "@apollo/client";

const DELETE_USER_SUBSCRIPTION = gql`
    subscription {
        userDeleted {
            pin
        }
    }
`

export default DELETE_USER_SUBSCRIPTION