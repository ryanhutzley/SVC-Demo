import React from "react";
import { useState, useMemo } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import "./App.css";
import PointsForm from "./components/PointsForm";
import Description from "./components/Description";

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const errorMessageTypes = {
	missingNumbers: "Missing number(s) for point values",
	labelRequirement: "Model requires at least 1 labeld and 1 unlabeld point",
	invalidPointsforSVC: "Cannot calculate decision boundary with provided points",
};

function App() {
	const [modelData, setModelData] = useState({
		xVals: [0, 0],
		yVals: [0, 0],
		labels: [0, 0],
	});
	const [errorStates, setErrorStates] = useState({ xVals: [], yVals: [], labels: [] });
	const [errorMsgs, setErrorMsgs] = useState([]);
	const [SVCresults, setSVCResults] = useState({
		fitStatus: false,
		modelAccuracy: 0,
		dbEndpoints: [],
		supportVectorIndices: [],
		margins: [],
		marginValue: 0,
	});

	const addField = () => {
		const x = [...modelData.xVals, 0];
		const y = [...modelData.yVals, 0];
		const l = [...modelData.labels, 0];
		setModelData({ ...modelData, xVals: x, yVals: y, labels: l });
	};

	const removeField = (idx) => {
		if (modelData.labels.length > 2) {
			const tempData = { ...modelData };
			const tempErrorStates = { ...errorStates };
			for (const key in tempData) {
				tempData[key].splice(idx, 1);
				const index = tempErrorStates[key].indexOf(idx);
				index > -1 && tempErrorStates[key].splice(index, 1);
			}
			setModelData(tempData);
			setErrorStates(tempErrorStates);
		}
	};

	const handleChange = (e, index) => {
		const tempData = { ...modelData };
		const name = e.target.name;
		if (name === "labels") {
			tempData[name][index] = e.target.checked ? 1 : 0;
			setModelData(tempData);
		} else {
			const value = parseFloat(e.target.value);
			if (isNaN(value)) {
				tempData[name][index] = "";
				setModelData(tempData);
				setErrorStates({ ...errorStates, [name]: [...errorStates[name], index] });
			} else {
				if (errorStates[name].includes(index)) {
					setErrorStates({ ...errorStates, [name]: errorStates[name].filter((i) => i !== index) });
				}
				tempData[name][index] = value;
				setModelData(tempData);
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const messages = [];
		if ([errorStates.xVals, errorStates.yVals].some((e) => e.length > 0)) {
			messages.push(errorMessageTypes.missingNumbers);
		}
		if (!(modelData.labels.includes(0) && modelData.labels.includes(1))) {
			messages.push(errorMessageTypes.labelRequirement);
		}

		if (messages.length > 0) {
			setErrorMsgs(messages);
		} else {
			fetch("/train", {
				method: "POST",
				headers: { "Content-type": "application/json" },
				body: JSON.stringify(modelData),
			}).then((res) => {
				if (res.ok) {
					res.json().then((data) => {
						console.log(data);
						setSVCResults({
							...SVCresults,
							fitStatus: data.fitStatus,
							modelAccuracy: data.modelAccuracy,
							dbEndpoints: data.dbEndpoints,
							supportVectorIndices: data.supportVectorIndices,
							margins: data.margins,
							marginValue: data.marginValue,
						});
						setErrorMsgs([]);
					});
				} else {
					setErrorMsgs([errorMessageTypes.invalidPointsforSVC]);
				}
			});
		}
	};

	const options = {
		scales: {
			x: {
				beginAtZero: true,
			},
			y: {
				beginAtZero: true,
			},
		},
		plugins: {
			title: {
				display: true,
				text: "Binary Classification Example",
			},
			legend: {
				display: true,
				labels: {
					usePointStyle: true,
				},
			},
			tooltip: {
				usePointStyle: true,
			},
		},
		maintainAspectRatio: false,
		responsive: true,
	};

	const labeledSVs = [];
	const labeledNonSVs = [];
	const unLabeledSVs = [];
	const unLabeledNonSVs = [];

	modelData.labels.forEach((l, i) => {
		const point = { x: modelData.xVals[i], y: modelData.yVals[i] };
		const isSV = SVCresults.supportVectorIndices.includes(i);
		if (l === 1) {
			isSV ? labeledSVs.push(point) : labeledNonSVs.push(point);
		} else {
			isSV ? unLabeledSVs.push(point) : unLabeledNonSVs.push(point);
		}
	});

	const data = {
		datasets: [
			{
				label: "Decision Boundary",
				data: SVCresults.dbEndpoints,
				backgroundColor: "rgba(0, 0, 255, 1)",
				borderColor: "rgba(0, 0, 255, 1)",
				showLine: true,
			},
			{
				label: "Upper Margin",
				data: SVCresults.margins[0],
				borderColor: "rgba(0, 255, 0, 0.25)",
				backgroundColor: "rgba(0, 255, 0, 0.25)",
				showLine: true,
			},
			{
				label: "Lower Margin",
				data: SVCresults.margins[1],
				borderColor: "rgba(255, 0, 0, 0.25)",
				backgroundColor: "rgba(255, 0, 0, 0.25)",
				showLine: true,
			},
			{
				label: "Labeled Non-SVs",
				data: labeledNonSVs,
				borderColor: "rgba(0, 255, 0, 1)",
				backgroundColor: "rgba(0, 0, 0, 0)",
			},
			{
				label: "Unlabeled Non-SVs",
				data: unLabeledNonSVs,
				borderColor: "rgba(255, 0, 0, 1)",
				backgroundColor: "rgba(0, 0, 0, 0)",
			},
			{
				label: "Labeled SVs",
				data: labeledSVs,
				borderColor: "rgba(0, 255, 0, 1)",
				backgroundColor: "rgba(0, 255, 0, 1)",
			},
			{
				label: "Unlabeled SVs",
				data: unLabeledSVs,
				borderColor: "rgba(255, 0, 0, 1)",
				backgroundColor: "rgba(255, 0, 0, 1)",
			},
		],
	};

	console.log(modelData);

	return (
		<>
			<div className="chart">
				<Scatter options={options} data={data} />
			</div>
			{SVCresults.fitStatus === 0 && (
				<Description
					fitStatus={SVCresults.fitStatus}
					modelAccuracy={SVCresults.modelAccuracy}
					marginValue={SVCresults.marginValue}
				/>
			)}
			<PointsForm
				modelData={modelData}
				addField={addField}
				removeField={removeField}
				handleSubmit={handleSubmit}
				handleChange={handleChange}
				errorStates={errorStates}
				errorMsgs={errorMsgs}
			/>
		</>
	);
}

export default App;
