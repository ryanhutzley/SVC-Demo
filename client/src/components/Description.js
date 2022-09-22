function Description({ fitStatus, modelAccuracy, marginValue }) {
	return (
		<div className="description">
			<h3 style={{ textAlign: "center" }}>SVC Metrics</h3>
			<ul>
				<li>Fit Status: {fitStatus === 0 ? "Success" : "Failure"}</li>
				<li>Model Accuracy: {modelAccuracy * 100}%</li>
				<li>Margin Value: {marginValue}</li>
			</ul>
		</div>
	);
}

export default Description;
