import { Router } from "express"
import type { ApiError } from "@homie/shared"
import { requireAuth } from "../middleware/requireAuth"
import { createTenancy, listTenanciesForUser, getTenancyForMember } from "../services/tenancyService"

export const tenancyRouter = Router()

tenancyRouter.use(requireAuth)

tenancyRouter.post("/", async (req, res, next) => {
    const { addressLine, unit, city, province } = req.body ?? {}

    if (!addressLine || !city || !province) {
        const body: ApiError = { code: "MISSING_FIELDS", message: "addressLine, city and province are required" }
        return res.status(400).json(body)
    }

    if (province !== "ON") {
        const body: ApiError = { code: "INVALID_PROVINCE", message: "Only ON is supported right now" }
        return res.status(400).json(body)
    }

    try {
        const tenancy = await createTenancy({
            userId: req.session.userId!,
            addressLine,
            unit,
            city,
            province
        })
        res.status(201).json(tenancy)
    } catch (err) {
        next(err)
    }
})

tenancyRouter.get("/", async (req, res, next) => {
    try {
        const tenancies = await listTenanciesForUser(req.session.userId!)
        res.json(tenancies)
    } catch (err) {
        next(err)
    }
})

tenancyRouter.get("/:id", async (req, res, next) => {
    try {
        const tenancy = await getTenancyForMember(req.params.id, req.session.userId!)

        if (!tenancy) {
            const body: ApiError = { code: "NOT_FOUND", message: "Tenancy not found" }
            return res.status(404).json(body)
        }

        res.json(tenancy)
    } catch (err) {
        next(err)
    }
})