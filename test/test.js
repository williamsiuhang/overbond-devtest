const assert = require('assert');
const { BondUtils } = require('../utils/index.js');


describe('Bond Utilities', () => {

  it('Filter JSON data into government or corporate arrays based on type', () => {

    let input = [
      {
        "bond": "c1",
        "type": "corporate",
        "term": "10.3 years",
        "yield": "5.30%"
      },
      {
        "bond": "g1",
        "type": "government",
        "term": "9.4 years",
        "yield": "3.70%"
      }
    ]
    assert.deepStrictEqual(input[0], BondUtils.filterBondsByType(input).bondsCorporate[0]);
    assert.deepStrictEqual(input[1], BondUtils.filterBondsByType(input).bondsGovernment[0]);
  });

  it('Exclude invalid bond objects / missing properties from JSON data', () => {

    let input = [
      {
        "bond": "c1",
        "type": "corporate",
        "term": "10.3 years",
        "yield": "5.30%"
      },
      {
        "bond": "c2",
        "type": "corporate",
        "term": "13.5 years",
        "yield": null
      }
    ];

    assert.strictEqual(1, BondUtils.filterBondsByType(input).bondsCorporate.length)
  });

  it('Sort array of bond objects by term', () => {

    let input = [
      { id: 'A', term: '4.0 years' },
      { id: 'B', term: '16.0 years' },
      { id: 'C', term: '2.5 years' },
      { id: 'D', term: '12.0 years' }
    ];

    assert.deepStrictEqual(['C','A','D','B'], BondUtils.sortBondsByTerm(input).map(item => item.id));
  });

  it('Find the government bond benchmark based on closest term. Use bond with closest yield if terms are tied', () => {

    let inputBondsCorp = [
      { bond: 'A', term: '2.0 years', yield: '3.5%' },
      { bond: 'B', term: '4.0 years', yield: '2.75%' },
      { bond: 'C', term: '6.0 years', yield: '4.0%' },
      { bond: 'D', term: '8.0 years', yield: '5.2%' }
    ];
    let inputBondsGov = [
      { bond: 'E', term: '2.5 years', yield: '4.2%' },
      { bond: 'F', term: '3.0 years', yield: '2.5%' },
      { bond: 'G', term: '5.0 years', yield: '3.0%' },
      { bond: 'H', term: '8.5 years', yield: '5.0%' }
    ]

    // findNearestBondByTenor
    assert.deepStrictEqual([
      { bond: 'A', benchmark: 'E', spread_to_benchmark: '0.70%' },
      { bond: 'B', benchmark: 'F', spread_to_benchmark: '0.25%' },
      { bond: 'C', benchmark: 'G', spread_to_benchmark: '1.00%' },
      { bond: 'D', benchmark: 'H', spread_to_benchmark: '0.20%' }
    ]
    , BondUtils.findBenchmark(inputBondsCorp, inputBondsGov));
  });

});