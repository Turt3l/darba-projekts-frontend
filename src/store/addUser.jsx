import { gql } from "@apollo/client";
    const ADD_USER = gql`
    mutation AddUser($username: String!, $role: String!) {
        addUser(username: $username, role: $role) {
          username
          role
          pin
          isOnline
          isAlerted
        }
      }
    `

export default ADD_USER