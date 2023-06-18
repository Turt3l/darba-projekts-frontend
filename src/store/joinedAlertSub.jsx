import { gql } from "@apollo/client";

const JOINED_ALERT_SUBSCRIPTION = gql`
    subscription {
        userAlert {
            username
            isOnline
            joinedAlert
            pin
        }
    }
`
export default JOINED_ALERT_SUBSCRIPTION