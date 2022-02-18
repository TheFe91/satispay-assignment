import React from "react";
import { Button, Result } from "antd";
import { useHistory } from "react-router";

const NotFound = () => {
	const history = useHistory();

	const handleOnClick = () => {
		history.replace("/");
	};

	return (
		<Result
			extra={<Button onClick={handleOnClick} type="primary">Back Home</Button>}
			status="404"
			subTitle="Sorry, the page you visited does not exist."
			title="404"
		/>
	);
};

export default React.memo(NotFound);
