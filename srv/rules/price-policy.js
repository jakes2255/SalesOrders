/*CAP rules: BRF+ alternative in CAP
*/
//Create a rule module
module.exports = function determinePrice({ category, basePrice }) {
  if (category === 'EDU') return basePrice * 0.8;
  if (category === 'PREMIUM') return basePrice * 1.2;
  return basePrice;
};