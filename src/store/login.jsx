import { gql } from "@apollo/client";

const LOGIN = gql`
    mutation LogIn($pin: Int!) {
        login(pin: $pin) {
            token
            user {
                username
                isOnline
                isAlerted
                role
            }
        }
    }
` 

export default LOGIN