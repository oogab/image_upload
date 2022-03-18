import React, { useEffect, useState } from "react";
import axios from "axios"

const ImageList = () => {
	const [images, setImages] = useState([])
	// 내부의 state를 바꾸는 것을 side effect가 발생했다고 한다.
	useEffect(() => {
		axios
			.get("/images")
			.then(result => setImages(result.data))
			.catch(err => console.error(err))
	}, [])
	const imgList = images.map(image => (
		<img
			style={{ width: "100%" }}
			src={`http://localhost:5001/uploads/${image.key}`}
		/>
	))

	return (
		<div>
			<h3>Image List</h3>
			{imgList}
		</div>

	)
}

export default ImageList