import { gql } from "@apollo/client";

const START_ALERT = gql`
    mutation startAlert($note: String!, $alertedUsers: [UserAlertInput]!) {
        startAlert(note: $note, alertedUsers: $alertedUsers) {
            note
            alertedUsers {
                username
                isAlerted
                pin
            }
        }
    }
`
export default START_ALERT