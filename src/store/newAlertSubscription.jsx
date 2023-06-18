import { gql } from "@apollo/client";

const NEW_ALERT_SUBSCRIPTION = gql`
    subscription {
        newAlert {
            note
            alertedUsers {
                isAlerted
                pin
                username
            }
            id
        }
    }
`

export default NEW_ALERT_SUBSCRIPTION