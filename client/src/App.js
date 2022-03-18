import React, { useState, useEffect } from "react";
import axios from "axios"
import UploadForm from "./components/UploadForm";
import ImageList from "./components/ImageList"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [images, setImages] = useState([])
	// 내부의 state를 바꾸는 것을 side effect가 발생했다고 한다.
	useEffect(() => {
		axios
			.get("/images")
			.then(result => setImages(result.data))
			.catch(err => console.error(err))
	}, [])

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <h2>사진첩</h2>
      <UploadForm images={images} setImages={setImages} />
      <ImageList images={images} />
    </div>
  );
};

export default App;
