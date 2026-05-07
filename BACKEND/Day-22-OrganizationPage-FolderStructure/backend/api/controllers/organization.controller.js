import { organizationModel } from "../models/organization.schema.js"

// CREATE
export const createOrganization = async (req, res, next) => {
    try {
        const { legalName, dbaName, address, primaryContact, phoneNumber, website, identifiers } = req.body

        if (!legalName || !dbaName) {
            return res.status(400).json({
                message: "LegalName or DbaName is required"
            })
        };

        const isCompanyExist = {
            $or: [{ dbaName }, { phoneNumber }, { website }]
        }

        const isCompany = await organizationModel.findOne(isCompanyExist)
        if (isCompany) {
            return res.status(400).json({
                message: "Company already exists"
            })
        }
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

// READ

export const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await organizationModel.find()
        if (!companies || companies.length === 0) {
            return res.status(200).json({
                message: "No company found"
            })
        }
        return res.status(200).json({
            data: companies,
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}