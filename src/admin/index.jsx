import AddUserList from "./add";
import UserList from "./users";

export default function AdminPanel() {
    return(
        <div className="adminPanel">
            <div className="addUserContainer">
                <div className="addUser">
                    <AddUserList/>
                </div>
            </div>
            <div className="UserListContainer">
                <div className="UserList">
                    <UserList/>
                </div>
            </div>
        </div>
    )
}