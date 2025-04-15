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

Unfortunately, we didn't have enough time to optimize the website for a variety of device screens and browsers. The main development was done on Firefox at a screen resolution of ~1080x1000, so if graphics show up funky, try zooming out for the original experience.

Additionally, some visual bugs are present (especially with the map) on Google Chrome - we were unable to override the select functionality.

## Reminders

Make sure if you're working on data to run `source ./activate.sh` in the `data-exploration/` directory to create a venv, select the `venv/bin/python` file as your Python interpreter, and use the interpreter in the Jupyter Notebook.

When making changes, make sure to checkout to a new branch -- when committing, run `npm run format` to format all files according to the project's style guidelines and `npm run lint` to view any violations to style/code guidelines.
