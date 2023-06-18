import { gql } from "@apollo/client";

const JOIN_ALERT = gql`
    mutation($pin: Int!) {
        joinAlert(pin: $pin)
    }
`
export default JOIN_ALERT