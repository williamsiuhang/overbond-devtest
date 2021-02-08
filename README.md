## OverBond Code Assessment

This repo is the solution to the coding assessment / devtest for OverBond.

This solution uses a CLI tool to calculate the corporate / government benchmark yield spread, or the spread to the given government bond curve.


## Installation (Docker)

Clone repo to local. Add CSV data files inside (recommended) `/data`


Inside project root folder run:

`docker build -t williamsi/overbond .`

Open docker dashboard, and run Image named williamsi/overbond


Open shell / console for the started container.

`overbond-cli [input-path] [option]`

where `input-path` is the file path to the input CSV

and `option` can be one of `-benchmark` or `-curve`


i.e.

`overbond-cli data/sample_input.csv -benchmark`

`overbond-cli data/sample_input2.csv -curve`