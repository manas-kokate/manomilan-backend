import mongoose from 'mongoose'
import stateModel from './state.model.js';
import locationEntryModel from './location.entry.js';

const countrySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    }
})

export default mongoose.model('country', countrySchema);