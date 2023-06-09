import React, { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AppState } from "../App";

const Header = () => {
  const useAppState = useContext(AppState);

  return (
    <div className="sticky z-10 header top-0 text-3xl flex justify-between items-center text-white font-bold p-3 border-b-2 border-gray-500)">
      <Link to={"/"}>
        <span>
          Movies<span className="text-blue-600">Hub</span>
        </span>
      </Link>
      {useAppState.login ? (
        <Link to={"/addmovie"}>
          <h1 className="text-lg cursor-pointer flex items-center ">
            <Button variant="outlined">
              <AddIcon className="mr-1" color="inherit" />
              <span className="text-white">Add New</span>
            </Button>
          </h1>
        </Link>
      ) : (
        <Link to={"/login"}>
          <h1 className="text-lg cursor-pointer flex items-center">
            <Button variant="outlined">
              <span className="text-white font-medium capitalize">Log in</span>
            </Button>
          </h1>
        </Link>
      )}
    </div>
  );
};

export default Header;
