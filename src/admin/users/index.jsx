import getUsers from "../../store/getUsers";
import "./users.scss";
import REMOVE_USER from "../../store/deleteUser";
import { useMutation, useSubscription } from "@apollo/client";
import NEW_USER_SUBSCRIPTION from "../../store/newUserSubscription";
import USER_ONLINE_SUBSCRIPTION from "../../store/userOnlineSubscription";
import { useEffect, useState } from "react";
import DELETE_USER_SUBSCRIPTION from "../../store/deleteUserSubscription";

export default function UserList() {
  const { usersLoading, usersData, usersError } = getUsers("all");
  const [userData, setUserData] = useState(usersData);

  useEffect(() => {
    setUserData(usersData);
  }, [usersData]);

  const { data: subscriptionData = {}, loading: subscriptionLoading, subscriptionError } = useSubscription(
    NEW_USER_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        const addedUser = subscriptionData.data.userAdded;
        setUserData((prevData) => {
          if (prevData) {
            return { ...prevData, users: [...prevData.users, addedUser] };
          } else {
            return { users: [addedUser] };
          }
        });
      },
    }
  );

  const { data: onlineData = {}, loading: onlineLoading } = useSubscription(USER_ONLINE_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const updatedUser = subscriptionData.data.userOnline;
      setUserData((prevData) => {
        if (prevData) {
          const updatedUsers = prevData.users.map((user) =>
            user.pin === updatedUser.pin ? { ...user, isOnline: updatedUser.isOnline } : user
          );
          return { ...prevData, users: updatedUsers };
        } else {
          return null;
        }
      });
    },
  });
  const { data: removeSubData = {}, loading: removeSubLoading, removeSubError } = useSubscription(
    DELETE_USER_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        const removedUser = subscriptionData?.data?.userDeleted;
        setUserData((prevData) => {
          if (prevData) {
            const updatedUsers = prevData.users.filter((user) => user.pin !== removedUser.pin);
            return { ...prevData, users: updatedUsers };
          } else {
            return null;
          }
        });
      },
    }
  );
  const [removeUserMutation, { removeLoading, removeError, removeData }] = useMutation(REMOVE_USER);
  if (usersLoading) return <h1>Loading...</h1>;
  if (usersError) return <h1>Error...</h1>;

  const handleUserRemove = (pin) => {
    removeUserMutation({ variables: { pin: pin } });
  };

  const RenderedUsers = userData?.users.map((user) => (
    <div className="userContainer" key={user.pin}>
      <div className="userDataContainer">
        <div className="onlineContainer">
          <div className={`onlineCheck ${user.isOnline ? "online" : ""}`} />
        </div>
        <div className="usernameContainer">
          <p>{user.username}</p>
        </div>
        <div className="roleContainer">
          <p>{user.role}</p>
        </div>
        <div className="pinContainer">
          <p>{user.pin}</p>
        </div>
        <div className="alertContainer">
          <p>{user.isAlerted ? <div>on alert</div> : <div>on standby</div>}</p>
        </div>
        {user.role === "Admin" ? (
          <div />
        ) : (
          <div className="deleteButtonContainer">
            <div className="deleteButton">
              {user.isAlerted ? (
                <div>on alert</div>
              ) : (
                <div className="button" onClick={() => handleUserRemove(parseInt(user.pin))}>
                  Remove
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  ));

  return <div className="activeUserContainer">{RenderedUsers}</div>;
}