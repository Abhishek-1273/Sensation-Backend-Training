import { organizationModel } from "../models/organization.schema.js"

export const createOrganization = async (req, res, next) => {
    try {
        const { legalName, dbaName, address, primaryContact, phoneNumber, website, identifiers } = req.body

        if (!legalName || !dbaName) {
            return res.status(400).json({
                message: "LegalName and DbaName is required"
            })
        };

        const organization = await organizationModel.create({
            legalName,
            dbaName,
            address,
            primaryContact,
            phoneNumber,
            website,
            createdBy: req.user.id,
            identifiers
        });
        return res.status(201).json({
            message: "Organization create successfully",
            data: organization,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}