import React, { useContext, useEffect, useState } from "react";
import ReactStars from "react-stars";
import { reviewRefrence, db } from "../firebase/firebase";
import {
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { AppState } from "../App";
import { useNavigate } from "react-router-dom";

const Reviews = ({ id, prevRating, userRated }) => {
  const useAppState = useContext(AppState);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [loading, setLaoding] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [form, setForm] = useState("");
  const [data, setData] = useState([]);
  const [addedReview, setAddedReview] = useState(0);
  // sending the review
  const sendReview = async () => {
    setLaoding(true);
    try {
      if (useAppState.login) {
        await addDoc(reviewRefrence, {
          movieid: id,
          name: useAppState.userName,
          rating: rating,
          thought: form,
          timestamp: new Date().getTime(),
        });

        // updating the database
        const docRef = doc(db, "movies", id);
        await updateDoc(docRef, {
          rating: prevRating + rating,
          rated: userRated + 1,
        });

        // resetting the values
        setRating(0);
        setForm("");
        setAddedReview(addedReview + 1);

        // sweet alert
        swal({
          title: "Review Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
      } else {
        navigate("/login");
      }
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
    setLaoding(false);
  };

  // get the reviews
  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      // removing the previous data from the state
      setData([]);
      // get all docs with matching id
      let checkQuery = query(reviewRefrence, where("movieid", "==", id));
      const querySnapshot = await getDocs(checkQuery);
      // get all the data of an element
      querySnapshot.forEach((doc) => {
        setData((prev) => [...prev, doc.data()]);
      });

      setReviewsLoading(false);
    }
    getData();
  }, [addedReview]);
  return (
    <div className="mt-4 border-t-2 border-gray-700 w-full">
      <ReactStars
        size={30}
        half={true}
        value={rating}
        onChange={(rate) => setRating(rate)}
      />
      <input
        className="w-full p-2 outline-none header"
        placeholder="What's your thoughts?"
        value={form}
        onChange={(e) => setForm(e.target.value)}
      />
      <button
        onClick={sendReview}
        className="bg-green-600 flex justify-center w-full p-1"
      >
        {loading ? <TailSpin height={15} color="white" /> : "Share"}
      </button>

      {reviewsLoading ? (
        <div className="flex justify-center mt-5">
          <ThreeDots height={15} color="white" />
        </div>
      ) : (
        <div className="mt-4">
          {data.map((e, i) => {
            return (
              <div key={i} className="bg-gray-700 p-2 w-full mt-2">
                <div className="flex justify-between">
                  <p>{e.name}</p>
                  <p className="ml-3">
                    {new Date(e.timestamp).toLocaleString()}
                  </p>
                </div>
                <ReactStars
                  size={20}
                  half={true}
                  value={e.rating}
                  edit={false}
                />
                <p>{e.thought}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
