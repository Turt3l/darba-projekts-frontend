import { gql } from "@apollo/client";
const REMOVE_ALERT = gql`
    mutation($id: String!) {
        deleteAlert(id: $id)
    }
`
export default REMOVE_ALERT