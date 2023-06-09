import Header from "./components/Header";
import Card from "./components/Card";
import AddMovie from "./components/AddMovie";
import { Routes, Route } from "react-router-dom";
import Detail from "./components/Detail";
import { createContext, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

const AppState = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <AppState.Provider value={{ login, userName, setLogin, setUserName }}>
      <div className="App relative">
        <Header />
        <Routes>
          <Route path="/" element={<Card />}></Route>
          <Route path="/addmovie" element={<AddMovie />}></Route>
          <Route path="/detail/:id" element={<Detail />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </div>
    </AppState.Provider>
  );
}

export default App;
export { AppState };
