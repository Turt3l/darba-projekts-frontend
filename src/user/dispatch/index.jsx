import { useState, useEffect } from "react";
import getUsers from "../../store/getUsers";
import { useMutation, useSubscription } from "@apollo/client";
import START_ALERT from "../../store/startAlert";
import GetAlerts from "../../store/getAlerts";
import REMOVE_ALERT from "../../store/deleteAlert";
import USER_ONLINE_SUBSCRIPTION from "../../store/userOnlineSubscription";
import NEW_ALERT_SUBSCRIPTION from "../../store/newAlertSubscription";
import JOINED_ALERT_SUBSCRIPTION from "../../store/joinedAlertSub";
import DELETE_ALERT_SUBSCRIPTION from "../../store/deleteAlertSubscription";

export default function DispatchPanel() {
  const { usersLoading, usersData, usersError } = getUsers("Responder");
  const { alertsLoading, alertsData, alertsError } = GetAlerts();
  const [alertedData, setAlertedData] = useState([]);
  const [acceptedAlerts, setAcceptedAlerts] = useState([]);
  useEffect(() => {
    if (alertsData) {
      setAlertedData(alertsData || []);
    }
  }, [alertsData]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (usersData) {
      setOnlineUsers(usersData.users || []);
    }
  }, [usersData]);
  const [note, setNote] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [startAlert, { loading, error, data }] = useMutation(START_ALERT);
  const [deleteAlert, { alertLoading, alertError, alertData }] = useMutation(REMOVE_ALERT);

  const handleUserSelection = (username) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== username));
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };

  const { data: newJoinData = {}, loading: newJoinLoading } = useSubscription(JOINED_ALERT_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const joinedUser = subscriptionData.data.userAlert;
      setAlertedData((prevAlerts) => {
        const updatedAlerts = prevAlerts.map((alert) => {
          const alertedUsers = alert.alertedUsers.map((user) => {
            if (user.username === joinedUser.username) {
              setAcceptedAlerts((prevAcceptedAlerts) => [...prevAcceptedAlerts, joinedUser.alertId]);
              return { ...user, hasJoined: joinedUser.joinedAlert };
            }
            return user;
          });
          return { ...alert, alertedUsers };
        });
        return updatedAlerts;
      });
    },
  });
  const handleDeleteClick = (id) => {
    deleteAlert({ variables: { id: id } });
    console.log(id);
  };

  useSubscription(NEW_ALERT_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newAlert = subscriptionData.data.newAlert;
      setAlertedData((prevAlerts) => [...prevAlerts, newAlert]);
    },
  });

  const { data: onlineData = {}, loading: onlineLoading } = useSubscription(USER_ONLINE_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const updatedUser = subscriptionData.data.userOnline;
      setOnlineUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.pin === updatedUser.pin ? { ...user, isOnline: updatedUser.isOnline } : user
          
        );
        return updatedUsers;
      });
      console.log("User online:", updatedUser);
    },
  });
  const AlertTable = alertedData && alertedData.map(alert => {
    return (
      <div className="alertContainer" key={alert.id}>
        <div className="alertNote">
          Alert note:
          <br />
          {alert.note}
        </div>
        <div className="alertedUsers">
          Alerted users:
          <br />
          {alert.alertedUsers?.map((user) => (
            <div key={user.username}>
              {console.log(user)}
              {user.username}
              {user.hasJoined ? <span> (Accepted)</span> : <span> (Not joined)</span>}
            </div>
          ))}
        </div>
        <div className="deleteContainer">
          <button onClick={() => handleDeleteClick(alert.id)}>Stop Alert</button>
        </div>
      </div>
    );
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedUsers.length === 0) {
      console.log("Please select at least one user.");
      return;
    }

    const alertedUsers = usersData.users
      .filter((user) => selectedUsers.includes(user.username))
      .map(({ username, pin, isAlerted, joinedAlert }) => ({ username, pin, isAlerted, joinedAlert }));

    startAlert({
      variables: { note, alertedUsers },
    })
      .then((response) => {
        console.log(response.data.startAlert);
        setSelectedUsers([]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (onlineData && onlineData.userOnline) {
      const updatedUser = onlineData.userOnline;
      setOnlineUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.pin === updatedUser.pin ? { ...user, isOnline: updatedUser.isOnline } : user
        );
        return updatedUsers;
      });
      console.log("User online:", updatedUser);
    }
  }, [onlineData]);
  const { data: removeAlertData = {}, loading: removeAlertLoading, removeAlertError } = useSubscription(
    DELETE_ALERT_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        const removedAlert = subscriptionData?.data?.deleteAlert;
        setAlertedData((prevData) => {
          const updatedAlerts = prevData.filter((alert) => alert.id !== removedAlert.id);
          return updatedAlerts;
        });
      },
    }
  );
  const isUserOnAlert = (username) => {
    return alertedData.some((alert) => {
      return alert.alertedUsers.some((user) => user.username === username);
    });
  };

  if (usersLoading) return <div>Loading</div>;
  if (usersError) return <div>Error</div>;
  if (alertsLoading) return <div>ALERTS LOADING</div>;
  if (alertsError) return <div>ALERTS ERROR</div>;

  return (
    <div className="dispatchPanel">
      <form onSubmit={handleSubmit}>
        <h1>New Alert</h1>
        <input
          className="note"
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <h3>Select Users</h3>
        {onlineUsers?.map((user) => (
          <div className="user" key={user.username}>
            {user.isAlerted ? (
              <div>{user.username} is already on alert</div>
            ) : (
              <label>
                <input
                  type="checkbox"
                  className="check"
                  checked={selectedUsers.includes(user.username)}
                  onChange={() => handleUserSelection(user.username)}
                  disabled={isUserOnAlert(user.username)}
                />
                {user.username}
                {user.isOnline ? <span> (Online)</span> : <span> (Offline)</span>}
              </label>
            )}
          </div>
        ))}
        <button type="submit">Start Alert</button>
      </form>
      <div className="alertList">{AlertTable}</div>
    </div>
  );
}