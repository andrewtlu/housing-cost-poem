# housing-cost-poem

CS441 Info Vis Project

## Getting Stared

### Running Code Locally

1. Clone this GitHub repository (`git clone https://github.com/andrewtlu/housing-cost-poem.git`)
2. Navigate into the `website` directory (`cd housing-cost-poem/website`)
3. Install necessary dependencies (`npm install`)
4. Run development environment (`npm run dev`)
5. Open website on Vite's exposed port (by default [http://localhost:5173/](http://localhost:5173/))

## Notes

Currently, we're planning on keyframing graph 1 and 2 to be both on verse 2 and create a word chart of words people associate with Home in the first verse.

We're also planning on introducing historic redlining data to verse 3 and doing a "guided tour" of Atlanta's historic redlining to the current housing costs in Atlanta.

Verse 4's charts' centroids are oversight on our part - since each `median_housing_cost` occurs for each race point, since they are from the same county, the comparison is pointless - instead, we'll rework the chart to show some more meaningful trends in data.

## Reminders

Make sure if you're working on data to run `source ./activate.sh` in the `data-exploration/` directory to create a venv, select the `venv/bin/python` file as your Python interpreter, and use the interpreter in the Jupyter Notebook.

When making changes, make sure to checkout to a new branch -- when committing, run `npm run format` to format all files according to the project's style guidelines and `npm run lint` to view any violations to style/code guidelines.
