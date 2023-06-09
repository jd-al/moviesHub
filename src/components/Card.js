import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { ThreeDots } from "react-loader-spinner";
import { getDocs } from "firebase/firestore";
import { moviesRefrence } from "../firebase/firebase";
import { Link } from "react-router-dom";

const Card = () => {
  const [data, setData] = useState([]);
  const [loading, setLaoding] = useState(false);

  useEffect(() => {
    async function getData() {
      setLaoding(true);
      const _data = await getDocs(moviesRefrence);
      _data.forEach((doc) => {
        setData((prev) => [...prev, { ...doc.data(), id: doc.id }]);
      });
      setLaoding(false);
    }
    getData();
  }, []);

  return (
    <div className="flex flex-wrap justify-between px-2 mt-2">
      {loading ? (
        <div className="w-full flex justify-center items-center h-96">
          <ThreeDots height={40} color="white" />
        </div>
      ) : (
        data.map((e, i) => {
          return (
            <Link key={i} to={`/detail/${e.id}`}>
              <div
                key={i}
                className="card w-44 font-medium shadow-lg p-2 hover:-translate-y-3 cursor-pointer mt-6 transition-all duration-500"
              >
                <img
                  className="h-60 md:h-72 md:object-cover "
                  src={e.image}
                  alt="Movie's Poster"
                />

                <h1>{e.title}</h1>
                <h1 className="flex items-center">
                  <span className="text-gray-500 mr-1">Rating:</span>
                  <ReactStars
                    size={20}
                    half={true}
                    value={e.rating / e.rated}
                    edit={false}
                  />
                </h1>
                <h1>
                  <span className="text-gray-500">Year:</span> {e.year}
                </h1>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Card;
