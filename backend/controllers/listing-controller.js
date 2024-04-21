    import Listing from '../models/listing-model.js'
    import { errorHandler } from '../utils/error.js'

    export const createListing = async (req, res, next) => {
        try {
            const listing = await Listing.create(req.body)
            return res.status(201).json(listing)
        } catch (error) {
            next(error)
        }
    }

    export const deleteListing = async (req, res, next) => {
        const id = req.params.id
        const listing = await Listing.findById(id)
        try {
            if (listing.userRef !== req.user.id) {
                return next(errorHandler(401, 'Unauthorized'))
            }
            if (!listing) {
                return next(errorHandler(404, 'Listing not found'))
            }
            await Listing.findByIdAndDelete(id)
            res.status(200).json({message: 'Listing deleted!'})
        } catch (error) {
            next(error)
        }
    }

    export const updateListing = async (req, res, next) => {
        const id = req.params.id
        const listing = await Listing.findById(id)
        try {
            if (listing.userRef !== req.user.id) {
                return next(errorHandler(401, 'Unauthorized'))
            }
            if (!listing) {
                return next(errorHandler(404, 'Listing not found'))
            }
            const updatedListing = await Listing.findByIdAndUpdate(
                id, 
                req.body, 
                {new: true}
            )
            res.status(200).json(updatedListing)
        } catch (error) {
            next(error)
        }
    }

    export const getListing = async (req, res, next) => {
        const id = req.params.id
        try {
            const listing = await Listing.findById(id)
            if (!listing) {
                return next(errorHandler(404, 'Listing not found'))
            }
            res.status(200).json(listing)
        } catch (error) {
            next(error)
        }
    }