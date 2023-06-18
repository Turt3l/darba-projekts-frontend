import { gql } from "@apollo/client";

const USER_ONLINE = gql`
    mutation($pin: Int!) {
        userOnline(pin: $pin)
    }
`

export default USER_ONLINE