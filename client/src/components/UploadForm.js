import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("이미지 파일을 업로드 해주세요.");
  const [percent, setPercent] = useState(0);

  const imageSelectHandler = (event) => {
    const imageFile = event.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });
      console.log(res);
      toast.success("이미지 업로드 성공!");
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    // form tag에서 submit을 할 경우 default action이 새로고침
    // SPA이기 때문에 새로고침이 생기지 않도록 해야한다.
    <form onSubmit={onSubmit}>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input id="image" type="file" onChange={imageSelectHandler} />
      </div>
      <button
        type="submit"
        style={{ width: "100%", heigt: 40, borderRadius: 3, cursor: "pointer" }}
      >
        제출
      </button>
    </form>
  );
};

export default UploadForm;
