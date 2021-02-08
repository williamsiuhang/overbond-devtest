## OverBond Code Assessment

This repo is the solution to the coding assessment / devtest for OverBond.

This solution uses a __CLI tool__ to calculate the corporate / government benchmark yield spread, or the spread to the given government bond curve.


## Installation (Docker)

Clone repo to local. Add CSV data files inside (recommended) `/data`. Inside project root folder run:

`docker build -t williamsi/overbond .`

Open docker dashboard, and run Image named williamsi/overbond

Open shell / console for the started Docker container

`overbond-cli [input-path] [option]`

`input-path`: is the file path to the input CSV

`option`: can be one of `-benchmark` or `-curve`


#### Examples

`overbond-cli data/sample_input.csv -benchmark`

`overbond-cli data/sample_input2.csv -curve`


## Installation (NPM)

If you have node and npm installed on your machine, run the node app from the project root folder:

`npm install`

`node index.js data/sample_input.csv -benchmark`

Or turn it into a CLI
1. `npm link`
2. `overbond-cli pathname -option`