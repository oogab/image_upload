import React, { useEffect, useState } from "react";
import axios from "axios"

const ImageList = ({ images }) => {
	// Warning: Each child in a list should have a unique "key" prop
	// React에서 흔하게 발생하는 경고 메세지
	// list가 길어질 경우, 수정, 삭제, 생성 등등의 작업에서 효과적인 비교를 위해 key 속성 필요
	const imgList = images.map(image => (
		<img
			key={image.key} // 데이터의 고유값을 사용하는 것이 좋다.
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