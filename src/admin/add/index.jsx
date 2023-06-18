import { useState } from "react";
import "./add.scss"
import ADD_USER from "../../store/addUser";
import { useMutation } from "@apollo/client";

export default function AddUserWindow() {

    const [name, setName] = useState("");
    const [option, setOption] = useState("")
    const [formVisible, setFormVisible] = useState(false)


    const handleInputChange = (event) => {
      setName({ name: event.target.value });
    };
   
    const handleOptionChange = (event) => {
        setOption({ option: event.target.options[event.target.selectedIndex].text})
    }
   
    
    const [addUserMutation, { loading, error, data }] = useMutation(ADD_USER);
    

    const handleAddUser = () => {
        addUserMutation({ variables: { username: name.name, role: option.option } });
    };

    return(
        <div className="addUserContainer">
            <div className="addUserToggleButton">
                <div className="buttonContainer">
                    <button onClick={() => setFormVisible(!formVisible)}>ADD +</button>
                </div>
            </div>
            <div className={`addUserForm ${formVisible ? "visible" : ""}`}>
                <div className="addUsername">
                    <input placeholder="Username" className="nameInput" onChange={handleInputChange} type="text"></input>
                </div>
                <div className="addRole">
                    <select onChange={handleOptionChange}>
                        <option selected disabled>
                            Select role
                        </option>
                        <option>
                            Dispatch
                        </option>
                        <option>
                            Responder
                        </option>
                    </select>
                </div>
                <div className="addUser">
                    <button onClick={handleAddUser}>
                        +
                    </button>
                </div>
            </div>
        </div>

    )
}
