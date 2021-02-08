const BigNumber = require('bignumber.js');

/**
 * Exclude data with missing or invalid properties. Returns true if bond object is valid.
 *
 * @param {Object} bondData     bond detailed object
 * @returns {Boolean}
 */
const validateBond = (bondData) => {
  // check if any properties missing
  if (!bondData.hasOwnProperty('bond') || !bondData.hasOwnProperty('type') || !bondData.hasOwnProperty('term') || !bondData.hasOwnProperty('yield'))
    return false;

  // check if values are valid
  if (!bondData.bond || bondData.bond.length === 0) return false;
  if (!bondData.type || (bondData.type !== 'government' && bondData.type !== 'corporate')) return false;
  if (!bondData.term || isNaN(parseFloat(bondData.term))) return false;
  if (!bondData.yield || isNaN(parseFloat(bondData.yield))) return false;

  return true;
}

/**
 * Filter bonds based on type: government or corporate
 *
 * @param {Array} bonds     array of bond objects
 * @returns {Object}        Object containing bondsGovernment and bondsCorporate arrays
 */
const filterBondsByType = (bonds) => {
  let bondsGovernment = [];
  let bondsCorporate = [];

  bonds.forEach(bond => {
    // validate data
    if (!validateBond(bond))
      return;

    // filter by type
    else if (bond.type == 'government') bondsGovernment.push(bond);
    else if (bond.type == 'corporate') bondsCorporate.push(bond);
  });

  return { bondsGovernment, bondsCorporate };
}

/**
 * Sort bonds by term
 *
 * @param {Array} bonds     array of bond objects
 * @returns {Array}         array of bond objects sorted by term, shortest to longest
 */
const sortBondsByTerm = (bonds) => {
  return bonds.sort((bondA, bondB) => {
    let tenorA = parseFloat(bondA.term);
    let tenorB = parseFloat(bondB.term);

    if (tenorA < tenorB) return -1;
    if (tenorA > tenorB) return 1;
    return 0;
  });
}

/**
 * Find closest government benchmark based on term
 *
 * @param {Object} bond               detailed bond object
 * @param {Array} bondsGovernment     array of government bonds
 * @returns {Object}                  closest match government bond
 */
const findNearestBondByTerm = (bond, bondsGovernment) => {
  let termCorporate = parseFloat(bond.term);
  let yieldCorporate = parseFloat(bond.yield);

  return bondsGovernment.reduce((prev, current) => {

    let calcDifference = (input1, input2) => new BigNumber(input1).minus(input2).absoluteValue().toNumber();

    let termPrevDiff = calcDifference(parseFloat(prev.term), termCorporate);
    let termCurrDiff = calcDifference(parseFloat(current.term), termCorporate);

    // last bond is closer
    if (termPrevDiff < termCurrDiff)
      return prev;

    // current bond is closer
    else if (termPrevDiff > termCurrDiff)
      return current;

    // if terms are tied, use bond with closer yield
    else
      return calcDifference(parseFloat(prev.yield), yieldCorporate) > calcDifference(parseFloat(current.yield), yieldCorporate) ?
        current : prev;

  });
}

// Find government bond benchmark given corporate bond
const findBenchmark = (bondsCorporate, bondsGovernment) => {
  return bondsCorporate.map(bond => {

    let nearestBondGov = findNearestBondByTerm(bond, bondsGovernment);

    // calculate spread
    let yieldCorporate = new BigNumber(parseFloat(bond.yield));
    let yieldGovernment = new BigNumber(parseFloat(nearestBondGov.yield));

    let spread = yieldCorporate.minus(yieldGovernment).absoluteValue().toFixed(2);

    return {
      bond: bond.bond,
      benchmark: nearestBondGov.bond,
      spread_to_benchmark: `${spread}%`
    };

  });
}

module.exports = {
  filterBondsByType: filterBondsByType,
  sortBondsByTerm: sortBondsByTerm,
  findBenchmark: findBenchmark
};