import AdminPanel from "./admin";
import { Route, Routes, Navigate } from "react-router-dom";
import LogInForm from "./user";
import IsAuthicitated from "./user/isAuthicitated";
import LogPage from "./user/logged";
function App() {

  return (

    <div className="App">
      <Routes>
        <Route path="/admin-panel" element={<AdminPanel/>}/>
        <Route path="/" element={<LogInForm/>}/>
        <Route path="/login" element={<LogInForm/>} />
        {IsAuthicitated ? (
          <Route path={"/logged"} element={<LogPage />} />
        ) : (
          <Navigate to="/login" replace />
        )}
      </Routes>

    </div>
  );
}

export default App;
