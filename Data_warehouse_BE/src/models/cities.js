const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    countries: [{ type: Schema.Types.ObjectId, ref: 'Country' }]
}, { versionKey: false });

const CountrySchema = new Schema({
    regionID: {
        type: Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cities: [{ type: Schema.Types.ObjectId, ref: 'City' }]
}, { versionKey: false });

const CitySchema = new Schema({
    countryID: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { versionKey: false });

const Region = mongoose.model('Region', RegionSchema);
const Country = mongoose.model('Country', CountrySchema);
const City = mongoose.model('City', CitySchema);

module.exports = {
    Region,
    Country,
    City
}