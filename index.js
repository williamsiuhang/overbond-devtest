#!/usr/bin/env node
const fs = require('fs');
const Interpolation = require('everpolate');
const { parse, stringify } = require('csv/lib/sync');
const { BondUtils, CLI } = require('./utils/index.js');

// CLI
const cliOptions = process.argv.slice(2);
const inputPath = cliOptions[0];
const inputOption = cliOptions[1]; // -benchmark, -curve

CLI.validateParams(inputPath, inputOption);

// data input & output
const dataInput = fs.readFileSync(inputPath);
const dataRecords = parse(dataInput, { columns: true, skip_empty_lines: true });
const { bondsGovernment, bondsCorporate } = BondUtils.filterBondsByType(dataRecords);

// CLI options
switch (inputOption) {
  case '-benchmark':
    findBenchmark();
    break;

  case '-curve':
    findCurve();
    break;

  default:
    CLI.error('Invalid cli option used. Use -benchmark or -curve');
    break;
}


/**
 * Evaluates the yield spread return between a corporate bond and its government bond benchmark
 * console logs the result in a CSV readable format
 */
function findBenchmark() {

  // sort government bonds by tenor
  const bondsGovernmentSorted = BondUtils.sortBondsByTerm(bondsGovernment);

  // find nearest gov benchmark based on closest term
  const govBenchmark = BondUtils.findBenchmark(bondsCorporate, bondsGovernmentSorted);

  // csv format
  CLI.message(stringify(govBenchmark, { header: true }));
}

/**
 * Evaluates interpolating expontential at the set of numbers
 * or at a single number for the function y=f(x)
 */
function findCurve() {

  // government bond x y used for interpolation
  const bondDimensions = { x: [], y: [] };
  const bondSpreads = [];

  bondsGovernment.forEach(bond => {
    bondDimensions.x.push(parseFloat(bond.term));
    bondDimensions.y.push(parseFloat(bond.yield));
  });

  // calc yield curve spread
  bondsCorporate.forEach((bond, i) => {
    let bondTerm = parseFloat(bond.term);
    let bondYield = parseFloat(bond.yield);

    // linear interpolation | yield curve
    let linearInterpolatedN = Interpolation.linear(
      bondTerm,
      bondDimensions.x,
      bondDimensions.y
    );

    let spreadToCurve = bondYield - linearInterpolatedN;

    bondSpreads.push({
      bond: bond.bond,
      spread_to_curve: spreadToCurve.toFixed(2)
    });

  });

  CLI.message(stringify(bondSpreads, { header: true }));
}