# SVC-Demo

This project enables users to play around with a linear SVM (Support Vector Machine). Users provide labeled and unlabeled data points that are rendered on a Cartesian plane (powered by React & Chart.js). This data is served to a sklearn SVC model on the backend (FastAPI) that returns metrics around SVM performance + data necessary to render the decision boundary and margins. The purpose of this demo is to help demystify SVMs ✨

# Tech Stack

Frontend: React, Chart.js, react-chart-js-2 <br/>
Backend: FastAPI, scikit-learn

# Running the Project Locally

## Requirements

- `npm` v8 or higher
- `Python` v3.8.13 or higher
- `node` v16 or higher

# Setup

Fork and clone this repository

## Frontend

From parent directory...

```
cd client
npm install
npm start
```

This will spin up the React frontend on `http://localhost:3000`

## Backend

From parent directory...

```
cd backend
```

Create python virtual environment

- For users with `conda` distribution:
  - `conda create --name <venv> python=3.8`
  - `conda deactivate`
  - `conda activate <venv>`
- For other distributions:
  - `pip install virtualenv` (if not already installed)
  - `python3 -m venv <virtual-environment-name>`
  - `source env/bin/activate`

Next, install the necessary python packages in your virtual environment

```
pip install fastapi
pip install uvicorn
pip install scikit-learn
```

And finally...

```
uvicorn server:app --reload
```

This starts the server on `http://localhost:8000`

# Using the app

1. Choose x and y values for at least two points. (The model requires at least 1 labeled and 1 unlabeled point to generate a response)
2. Hit `Submit`!
3. Be AMAZED! 😮
4. Take a look at 1) the chart -- the legend describes what the different colors and shadings represent (SV = [Support Vector](https://towardsdatascience.com/support-vector-machine-introduction-to-machine-learning-algorithms-934a444fca47#:~:text=Support%20vectors%20are%20data%20points,help%20us%20build%20our%20SVM.)), and 2) the `SVC Metrics` section -- this contains "Fit Status", "Model Accuracy", and "Margin Value" information.
5. Play around with the demo! (add points, remove points, or change points to see how the SVM responds)

# Resources & Credits

If you want to learn more about SVMs, please check out Serafeim Loukas' ["Support Vector Machines (SVM) clearly explained: A python tutorial for classification problems with 3D plots"](https://towardsdatascience.com/support-vector-machines-svm-clearly-explained-a-python-tutorial-for-classification-problems-29c539f3ad8) or Alex Kataev's ["SVM Classification with sklearn.svm.SVC: How To Plot A Decision Boundary With Margins in 2D Space"](https://medium.com/geekculture/svm-classification-with-sklearn-svm-svc-how-to-plot-a-decision-boundary-with-margins-in-2d-space-7232cb3962c0) -- both of these articles helped make SVMs more intuitive for me, and I hope they do the same for you!

# Contact

If you have feedback or are interested in collaborating, I'd love to connect! My email is <ryanhutzley@gmail.com>. Or if you prefer LinkedIn, drop me a [DM](https://www.linkedin.com/in/ryan-hutzley-0246a8169/) 🙂
