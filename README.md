## OverBond Code Assessment

This repo is the solution to the coding assessment / devtest for OverBond.

This solution uses a __CLI tool__ to calculate the corporate / government benchmark yield spread, or the spread to the given government bond curve.


## Installation (Docker)

Clone repo to local. Add CSV data files inside (recommended) `/data`. Inside project root folder run:

`docker build -t williamsi/overbond .`

Open docker dashboard, and run Image named williamsi/overbond

Open shell / console for the started Docker container

#### Usage

Command line in Docker container shell: `overbond-cli [input-path] [option]`

`input-path`: is the file path to the input CSV

`option`: can be one of `-benchmark` or `-curve`


#### Examples

Pairing corporate bonds with its nearest government bond benchmark - based on term

`overbond-cli data/sample_input.csv -benchmark`

Find the yield curve spread between the corporate bond and government bond yield curve

`overbond-cli data/sample_input2.csv -curve`


## Installation (NPM)

If you have node and npm installed on your machine, run the node app from the project root folder:

`npm install`

`node index.js data/sample_input.csv -benchmark`

Or turn it into a CLI
1. `npm link`
2. `overbond-cli pathname -option`


## Technical spec

Node js + Docker

#### Third party libraries

##### BigNumber 
  - arbitrary-precision decimals and non-decimal arithmetic
  - more precise financial calculations

##### Chalk
  - Better console logging

##### CSV
  - Easy csv data parsing and writing

##### Everpolate
  - Linear Interpolation calculations for yield curve

##### Mocha
  - Testing framework


Few improvements to be made given more time:
   - main methods in index.js can be more modular
   - More test coverage
   - Runtime efficiency during benchmarking
