const commutesPerYear = 260 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 1.5;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;
  let vicinity;
  if (leg.distance.value < 15000)
    vicinity = "very close!";
  else if (15000 <= leg.distance.value && leg.distance.value < 30000)
    vicinity = "a little far...";
  else  
    vicinity = "DEEP!"

  return (
  <div>
    <h1>This restaurant is {vicinity}</h1>
    <h1>It is {leg.duration.text} away.</h1>
    <button className="button">SHOW MENU</button>
  </div>
  )
}
