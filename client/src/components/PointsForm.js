function PointsForm({ modelData, addField, removeField, handleSubmit, handleChange }) {
	return (
		<div className="form-container">
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
									/>
									,
									<input
										name="yVals"
										type="number"
										value={modelData.yVals[idx]}
										onChange={(e) => handleChange(e, idx)}
									/>
									)
								</div>
							);
						})}
					</div>
					<div className="column">
						<label for="labels">Label (0 or 1)</label>
						{modelData.labels.map((label, idx) => (
							<input
								key={idx}
								name="labels"
								type="number"
								value={label}
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
				<button type="button" onClick={() => addField()}>
					Add Fields
				</button>
				<button type="submit" onClick={(e) => handleSubmit(e)}>
					Submit
				</button>
			</form>
		</div>
	);
}

export default PointsForm;
