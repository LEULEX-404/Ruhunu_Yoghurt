import axios from 'axios';

export async function getCoordinates (address){
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1`;
    //space = %20 & comma = %2c
    //addressdetails =1 , get sub streets and things
    //limit=1 get most suitable route
    const res = await axios.get(url,{headers: {"Accept-language":"en"}});

    if(res.data.length === 0)
    {
        throw new Error("Address not found");
    }
    return{
        lat:parseFloat(res.data[0].lat),
        lng:parseFloat(res.data[0].lon),
    };
}

export async function getDrivingDistance(from, to)
{
    const url = `http://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
    //overview = false = without extra map details

    const res = await axios.get(url);
    const distanceKm = res.data.routes[0].distance/1000;
    return distanceKm;
}