import { gql, useQuery } from "@apollo/client"

const GetAlerts = () => {
    const GET_ALERTS = gql`
        query {
            alerts {
            note
            id
            alertedUsers {
                    pin
                    username
                }
            }
        }
    `
    const {loading, data, error} = useQuery(GET_ALERTS)
    const alertsLoading = loading
    const alertsData = data?.alerts
    const alertsError = error
    return {alertsLoading, alertsData, alertsError}
}
export default GetAlerts