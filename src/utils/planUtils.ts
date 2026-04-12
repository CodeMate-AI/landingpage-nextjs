// Types for the plan data structure
export interface PlanPrice {
    monthly: number
    yearly: number
}

export interface PlanAccess {
    chat: boolean
    context: {
        git: boolean
        commits: boolean
        docs: boolean
        codebase: {
            local: boolean
            cloud: boolean
            current: boolean
        }
    }
    modes: {
        eco: boolean
        normal: boolean
        pro: boolean
    }
    internet_search: boolean
    byok: boolean
    access_tokens: boolean
    code_evaluation: boolean
}

export interface PlanLimits {
    image: number
    internet_search: number
    rot: number
    cloud_kb: number
    autocomplete: number
    local_kb: number
    rpd: number // Requests per day
    access: PlanAccess
}

export interface Plan {
    _id: string
    type: string
    plan_id: string
    display_name: string
    price: PlanPrice
    limits: PlanLimits
    product: string[]
}

export interface CategorizedPlans {
    build: Plan[]
    c0: Plan[]
    cora: Plan[]
    ultimatePlan?: Plan
}

/**
 * Fetches all plans from the backend API
 * @returns Promise with array of plans
 */
export async function fetchPlans(): Promise<Plan[]> {
    try {
        const response = await fetch('https://backend.v3.codemate.ai/v2/plans', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensure fresh data
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        return data as Plan[]
    } catch (error) {
        console.error('Error fetching plans:', error)
        throw error
    }
}

/**
 * Categorizes plans by product type (build, c0, cora)
 * @param plans - Array of plans to categorize
 * @returns Object with plans categorized by product
 */

function fetchPlanById(allPlans: Plan[], planId: string) {
    try {
        return allPlans.find((plan) => plan.plan_id === planId)
    } catch (error) {
        console.error('Error fetching plan:', error)
        throw error
    }
}

export function categorizePlansByProduct(plans: any): CategorizedPlans {
    const categorized: CategorizedPlans = {
        build: [],
        c0: [],
        cora: [],
    }
    plans = plans.map((plan: any) => {
        const isLicensePlan = (plan.available_licenses?.length > 0) ? plan.available_licenses[0].license_id : null

        if (isLicensePlan) {
            const LicensePlanlimits = fetchPlanById(plans, isLicensePlan)
            plan.limits = LicensePlanlimits?.limits
        }
        return plan
    })
    // plans = plans.filter((plan) => !plan?.parent_license_id)
    plans = plans.filter((plan: any) => !plan?.parent_license_id)
    plans.forEach((plan: any) => {
        // Record ultimate plan if found
        if (plan.is_ultimate || plan.display_name.toLocaleLowerCase() === "codemate max") {
            categorized.ultimatePlan = plan
        }

        // Check which products this plan belongs to
        if (!(
            plan.is_ultimate ||
            plan.display_name.toLocaleLowerCase() === "codemate max" ||
            plan.display_name.toLocaleLowerCase() === "pro" ||
            plan.display_name.toLocaleLowerCase() === "pro plus" ||
            (plan.display_name.toLocaleLowerCase() === "max" && plan.product.includes("cora")) ||
            plan.display_name.toLocaleLowerCase() === "teams"
        )) {
            return
        }
        plan.product.forEach((productName: any) => {
            const normalizedProduct = productName.toLowerCase()
            if (normalizedProduct === 'build' && !categorized.build.find(p => p._id === plan._id)) {
                categorized.build.push(plan)
            } else if (normalizedProduct === 'c0' && !categorized.c0.find(p => p._id === plan._id)) {
                categorized.c0.push(plan)
            } else if (normalizedProduct === 'cora' && !categorized.cora.find(p => p._id === plan._id)) {
                categorized.cora.push(plan)
            }
        })
    })

    return categorized
}

/**
 * Fetches and categorizes all plans in one call
 * @returns Promise with categorized plans
 */
export async function fetchAndCategorizePlans(): Promise<CategorizedPlans> {
    const plans = await fetchPlans()
    return categorizePlansByProduct(plans)
}

const STATIC_BUILD_FEATURES: Record<string, string[]> = {
    'pro': [
        "200 requests per day",
        "Unlimited image uploads and processing",
        "Figma-to-code conversion",
        "Document (PDF, DOC, TXT, DOCX )Support",
        "Instant deployment with shareable links",
        "Source code download capability",
    ],
    'max': [
        "400 requests per day",
        "Unlimited image uploads and processing",
        "Figma-to-code conversion",
        "Document (PDF, DOC, TXT, DOCX )Support",
        "Instant deployment with shareable links",
        "Source code download capability",
    ],
    'teams': [
        "400 requests per day",
        "Unlimited image uploads and processing",
        "Figma-to-code conversion",
        "Voice Input Support",
        "Document (PDF, DOC, TXT, DOCX )Support",
        "Custom Domain",
        "Instant deployment with shareable links",
        "Source code download capability"
    ]
}

/**
 * Converts API plan data to the PlanInfo format used by PlanCard component
 * @param plan - Plan from API
 * @param isRecommended - Whether this plan should be marked as recommended
 * @returns PlanInfo object for PlanCard component
 */
export function convertToPlanInfo(plan: any, isRecommended: boolean = false) {
    return {
        id: plan._id,
        name: plan.display_name,
        title: plan.display_name,
        description: `For ${plan.type} users`,
        monthlyPrice: plan.price.monthly.toString(),
        yearlyPrice: plan.price.yearly.toString(),
        currency: "USD",
        highlight: isRecommended,
        features: (plan.product.includes('build')) ? STATIC_BUILD_FEATURES[plan.display_name.toLowerCase()] : extractFeatures(plan),
        monthlyCtaText: "Get Started",
        monthlyCtaLink: (plan.stripe_id?.monthly ? plan.stripe_id.monthly : "#"),
        yearlyCtaText: "Get Started",
        yearlyCtaLink: (plan.stripe_id?.yearly ? plan.stripe_id.yearly : "#"),
    }
}

/**
 * Extracts feature list from plan limits
 * @param plan - Plan object
 * @returns Array of feature strings
 */
function extractFeatures(plan: Plan): string[] {
    const features: string[] = []

    // Add limit-based features
    if (plan?.limits?.internet_search === -1) {
        features.push("Unlimited internet searches")
    } else if (plan?.limits?.internet_search > 0) {
        features.push(`${plan.limits.internet_search} internet searches`)
    }

    if (plan?.limits?.cloud_kb === -1) {
        features.push("Unlimited cloud knowledge base")
    } else if (plan?.limits?.cloud_kb > 0) {
        features.push(`${plan.limits.cloud_kb} cloud KB storage`)
    }

    if (plan?.limits?.autocomplete === -1) {
        features.push("Unlimited autocomplete")
    } else if (plan?.limits?.autocomplete > 0) {
        features.push(`${plan.limits.autocomplete} autocomplete suggestions`)
    }

    // Add access-based features
    if (plan?.limits?.access?.chat) {
        features.push("Chat access")
    }

    if (plan?.limits?.access?.context?.codebase?.cloud) {
        features.push("Knowledge Base")
    }

    if (plan?.limits?.access?.code_evaluation) {
        features.push("Code Evaluation")
    }

    if (plan?.limits?.access?.modes?.pro) {
        features.push("Pro mode access")
    }

    return features
}

/**
 * Formats a limit value for display in comparison tables
 * @param value - The limit value from API (-1 for unlimited)
 * @param unit - Optional unit to append (e.g., "/month", "GB", "Total")
 * @returns Formatted string for display
 */
export function formatLimitValue(value: number | undefined, unit: string = ''): string {
    if (value === undefined || value === null) {
        return 'N/A'
    }

    if (value === -1) {
        return 'Unlimited'
    }

    // Format large numbers with commas
    const formatted = value.toLocaleString()
    return unit ? `${formatted}${unit}` : formatted
}
