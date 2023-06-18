import { useMutation, useSubscription } from "@apollo/client";
import JOIN_ALERT from "../../store/joinAlert";
import NEW_ALERT_SUBSCRIPTION from "../../store/newAlertSubscription";
import { useEffect, useState } from "react";
import JOINED_ALERT_SUBSCRIPTION from "../../store/joinedAlertSub";
import DELETE_ALERT_SUBSCRIPTION from "../../store/deleteAlertSubscription";

export default function Alert(userData) {
  const [userAlert, setUserAlert] = useState(false);
  const [userJoinedAlert, setUserJoinedAlert] = useState(false);
  const [alertNote, setAlertNote] = useState("")
  const [joinAlert, { data: joinAlertData, error: joinAlertError, loading: joinAlertLoading }] = useMutation(JOIN_ALERT);

  useEffect(() => {
    setUserAlert(userData.userData.isAlerted)
    setUserJoinedAlert(userData.userData.joinedAlert)
  }, [])

  const handleJoinAlert = () => {
    joinAlert({ variables: { pin: userData.userData.pin } });
    setUserJoinedAlert(true);
  };

  const { data: newAlertData = {}, loading: newAlertLoading } = useSubscription(NEW_ALERT_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newAlert = subscriptionData.data.newAlert;
      console.log(newAlert);
      setAlertNote(newAlert.note)
      const userAddedToAlert =
        Array.isArray(newAlert.alertedUsers) &&
        newAlert.alertedUsers.some((user) => user.pin === userData.userData.pin);
      if (userAddedToAlert) {
        setUserAlert(true);
      }
    },
  });
  const { data: removeAlertData = {}, loading: removeAlertLoading, removeAlertError } = useSubscription(
    DELETE_ALERT_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        setUserJoinedAlert(false)
        setUserAlert(false)
      },
    }
  );
  const {data: newJoinData = {}, loading: newJoinLoading} = useSubscription(JOINED_ALERT_SUBSCRIPTION, {
    onSubscriptionData: ({subscriptionData}) => {
      console.log(subscriptionData.data.userAlert.joinedAlert)
    }
  })

  return (
    <div className="alertContainer">
      {userAlert ? (
        <div>
          on alert{" "}
          {userJoinedAlert ? (
            <div>
              <div>you have joined this alert</div>
            </div>

          ) : (
            <button onClick={handleJoinAlert}>accept alert</button>
          )}
        </div>
      ) : (
        <div>not on alert</div>
      )}
    </div>
  );
}