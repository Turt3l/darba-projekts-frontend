import { gql } from "@apollo/client";

const REMOVE_USER = gql`
    mutation($pin: Int!) {
        deleteUser(pin: $pin)
    }
`

export default REMOVE_USER