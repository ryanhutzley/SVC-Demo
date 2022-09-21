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

// TODO: Add custom legend that explains the different values
ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip);

function App() {
	const [modelData, setModelData] = useState({
		xVals: [0, 0],
		yVals: [0, 0],
		labels: [0, 0],
	});
	const [SVCresults, setSVCResults] = useState({
		fitStatus: false,
		modelAccuracy: 0,
		dbEndpoints: [],
		supportVectors: [],
		margins: [],
		marginValue: 0,
	});

	const points = modelData.xVals.map((v, idx) => {
		return { x: v, y: modelData.yVals[idx] };
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
			tempData.xVals.splice(idx, 1);
			tempData.yVals.splice(idx, 1);
			tempData.labels.splice(idx, 1);
			setModelData(tempData);
		}
	};

	const handleChange = (e, index) => {
		const tempData = { ...modelData };
		tempData[e.target.name][index] = parseInt([e.target.value]);
		setModelData(tempData);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetch("/train", {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify(modelData),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setSVCResults({
					...SVCresults,
					fitStatus: data.fitStatus,
					modelAccuracy: data.modelAccuracy,
					dbEndpoints: data.dbEndpoints,
					supportVectors: data.supportVectors,
					margins: data.margins,
					marginValue: data.marginValue,
				});
			});
	};

	//TODO: improve efficiency of conditional styling
	const setStyling = (labels, SVs) => {
		const borderColor = [];
		const backgroundColor = [];
		labels.forEach((l, idx) => {
			const color = l === 1 ? "rgba(0, 255, 0, 1)" : "rgba(255, 0, 0, 1)";
			borderColor.push(color);
			if (SVs.length > 0) {
				const SVstrings = SVs.map((v) => JSON.stringify(v));
				const background = SVstrings.includes(JSON.stringify(points[idx]));
				background ? backgroundColor.push(color) : backgroundColor.push("rgba(255, 0, 0, 0)");
			}
		});
		return [borderColor, backgroundColor];
	};

	const [borderColor, backgroundColor] = setStyling(modelData.labels, SVCresults.supportVectors);

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
		},
		maintainAspectRatio: false,
		responsive: true,
	};

	const data = {
		datasets: [
			{
				data: points,
				borderColor: borderColor,
				backgroundColor: backgroundColor.length > 0 ? backgroundColor : "rgba(255, 0, 0, 0)",
			},
			{
				data: SVCresults.dbEndpoints,
				backgroundColor: "rgba(0, 0, 255, 1)",
				borderColor: "rgba(0, 0, 255, 1)",
				showLine: true,
			},
			{
				data: SVCresults.margins[0],
				borderColor: "rgba(0, 255, 0, 0.25)",
				backgroundColor: "rgba(0, 255, 0, 0.25)",
				showLine: true,
			},
			{
				data: SVCresults.margins[1],
				borderColor: "rgba(255, 0, 0, 0.25)",
				backgroundColor: "rgba(255, 0, 0, 0.25)",
				showLine: true,
			},
		],
	};

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
			/>
		</>
	);
}

export default App;
