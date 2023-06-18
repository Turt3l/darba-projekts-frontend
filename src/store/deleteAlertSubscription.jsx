import { gql } from "@apollo/client";

const DELETE_ALERT_SUBSCRIPTION = gql`
    subscription {
        deleteAlert {
            id
            alertedUsers {
                username
            }
            note
        }
    }
`

export default DELETE_ALERT_SUBSCRIPTION