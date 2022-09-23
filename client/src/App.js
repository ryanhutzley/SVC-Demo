import React from "react";
import { useState } from "react";
import {
	Chart as ChartJS,
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
import Footer from "./components/Footer";

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
			font: {
				family: "'Roboto Mono', monospace",
				size: 18,
				weight: "400",
			},
		},
		legend: {
			display: true,
			labels: {
				usePointStyle: true,
				font: {
					family: "'Roboto Mono', monospace",
				},
			},
		},
		tooltip: {
			usePointStyle: true,
		},
	},
	maintainAspectRatio: false,
	responsive: true,
};

const errorMessageTypes = {
	missingNumbers: "Missing number(s) for point values",
	labelRequirement: "Model requires at least 1 labeled and 1 unlabeled point",
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
						// console.log(data);
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

	// grouping data based on label and SV status
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
				backgroundColor: "rgba(9, 4, 70, 1)",
				borderColor: "rgba(9, 4, 70, 1)",
				showLine: true,
			},
			{
				label: "Labeled Margin",
				data: SVCresults.margins[0],
				borderColor: "rgba(254, 185, 95, 0.25)",
				backgroundColor: "rgba(254, 185, 95, 0.25)",
				showLine: true,
			},
			{
				label: "Unlabeled Margin",
				data: SVCresults.margins[1],
				borderColor: "rgba(120, 111, 82, 0.25)",
				backgroundColor: "rgba(120, 111, 82, 0.25)",
				showLine: true,
			},
			{
				label: "Labeled Non-SVs",
				data: labeledNonSVs,
				borderColor: "rgba(254, 185, 95, 1)",
				backgroundColor: "rgba(0, 0, 0, 0)",
			},
			{
				label: "Unlabeled Non-SVs",
				data: unLabeledNonSVs,
				borderColor: "rgba(120, 111, 82, 1)",
				backgroundColor: "rgba(0, 0, 0, 0)",
			},
			{
				label: "Labeled SVs",
				data: labeledSVs,
				borderColor: "rgba(254, 185, 95, 1)",
				backgroundColor: "rgba(254, 185, 95, 1)",
			},
			{
				label: "Unlabeled SVs",
				data: unLabeledSVs,
				borderColor: "rgba(120, 111, 82, 1)",
				backgroundColor: "rgba(120, 111, 82, 1)",
			},
		],
	};

	// adjusting margin between legend and chart
	const legendMargin = {
		beforeInit(chart, legend, options) {
			const fitValue = chart.legend.fit;
			chart.legend.fit = function fit() {
				fitValue.bind(chart.legend)();
				return (this.height += 20);
			};
		},
	};

	const plugins = [legendMargin];

	// console.log(modelData);

	return (
		<div className="content-wrap">
			<div className="chart-container">
				<Scatter options={options} data={data} plugins={plugins} />
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
			<Footer />
		</div>
	);
}

export default App;
