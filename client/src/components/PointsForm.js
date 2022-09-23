function PointsForm({
	modelData,
	addField,
	removeField,
	handleSubmit,
	handleChange,
	errorStates,
	errorMsgs,
}) {
	return (
		<form>
			<div className="column-container">
				<div className="column">
					<label for="coordinates">Point (x,y)</label>
					{modelData.xVals.map((_data, idx) => {
						return (
							<div key={idx}>
								(
								<input
									name="xVals"
									type="number"
									value={modelData.xVals[idx]}
									onChange={(e) => handleChange(e, idx)}
									className={errorStates["xVals"].includes(idx) ? "input-error" : null}
								/>
								,
								<input
									name="yVals"
									type="number"
									value={modelData.yVals[idx]}
									onChange={(e) => handleChange(e, idx)}
									className={errorStates["yVals"].includes(idx) ? "input-error" : null}
								/>
								)
							</div>
						);
					})}
				</div>
				<div className="column">
					<label for="labels">Label</label>
					{modelData.labels.map((label, idx) => (
						<input
							key={idx}
							className="checkbox"
							name="labels"
							type="checkbox"
							checked={label === 1}
							onChange={(e) => handleChange(e, idx)}
						/>
					))}
				</div>
				<div className="column">
					<div>Remove</div>
					{modelData.labels.map((_label, idx) => (
						<button key={idx} type="button" onClick={() => removeField(idx)}>
							X
						</button>
					))}
				</div>
			</div>
			{errorMsgs.length > 0 && (
				<div className="error">
					{errorMsgs.map((msg, idx) => {
						return <p key={idx}>{msg}</p>;
					})}
				</div>
			)}
			<button type="button" onClick={() => addField()}>
				Add Fields
			</button>
			<button type="submit" onClick={(e) => handleSubmit(e)}>
				Submit
			</button>
		</form>
	);
}

export default PointsForm;
